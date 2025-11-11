from decimal import Decimal
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from trading.models import Asset, Holding, Order
from trading.order_engine import matching, validators
from trading.order_engine.fills import apply_fill
from trading.services import portfolio, pricing

User = get_user_model()


class OrderEngineTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="pass1234")
        self.profile = self.user.profile
        self.profile.current_balance = Decimal("100000")
        self.profile.save()
        self.asset = Asset.objects.create(symbol="AAPL", name="Apple", last_price=Decimal("150"))

    @mock.patch("trading.services.pricing._fetch_from_provider", return_value=Decimal("123.45"))
    def test_pricing_fetch_updates_asset(self, _mock_fetch):
        price = pricing.get_price("AAPL")
        self.assertEqual(price, Decimal("123.45"))
        self.asset.refresh_from_db()
        self.assertEqual(self.asset.last_price, Decimal("123.45"))

    @mock.patch("trading.services.pricing.get_price", return_value=Decimal("150"))
    def test_market_order_fill(self, _mock_price):
        order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.MARKET,
            side=Order.OrderSide.BUY,
            quantity=10,
        )
        matching.process_order(order)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.OrderStatus.FILLED)
        holding = Holding.objects.get(user=self.user, asset=self.asset)
        self.assertEqual(holding.quantity, 10)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.current_balance, Decimal("98500"))

    def test_limit_order_execution(self):
        order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.LIMIT,
            side=Order.OrderSide.BUY,
            quantity=5,
            limit_price=Decimal("140"),
        )
        with mock.patch("trading.services.pricing.get_price", return_value=Decimal("150")):
            matching.process_order(order)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.OrderStatus.OPEN)
        with mock.patch("trading.services.pricing.get_price", return_value=Decimal("135")):
            matching.process_order(order)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.OrderStatus.FILLED)

    def test_average_cost_basis_calculation(self):
        buy_order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.MARKET,
            side=Order.OrderSide.BUY,
            quantity=20,
        )
        apply_fill(buy_order, Decimal("100"), 10)
        apply_fill(buy_order, Decimal("110"), 10)
        holding = Holding.objects.get(user=self.user, asset=self.asset)
        self.assertEqual(holding.avg_cost_basis.quantize(Decimal("0.01")), Decimal("105.00"))

    def test_realized_and_unrealized_pnl(self):
        buy_order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.MARKET,
            side=Order.OrderSide.BUY,
            quantity=10,
        )
        apply_fill(buy_order, Decimal("100"), 10)
        sell_order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.MARKET,
            side=Order.OrderSide.SELL,
            quantity=5,
        )
        apply_fill(sell_order, Decimal("120"), 5)
        self.asset.last_price = Decimal("120")
        self.asset.save()
        pnl = portfolio.calculate_pnl(self.user)
        self.assertEqual(pnl["realized"], Decimal("100.00"))
        self.assertEqual(pnl["unrealized"], Decimal("100.00"))
        self.assertEqual(pnl["total"], Decimal("200.00"))

    def test_balance_validation(self):
        with self.assertRaises(ValidationError):
            validators.validate_order_request(
                user=self.user,
                asset=self.asset,
                order_type=Order.OrderType.MARKET,
                side=Order.OrderSide.BUY,
                quantity=100000,
                limit_price=None,
                market_price=Decimal("150"),
            )

    def test_matching_process_open_orders(self):
        order = Order.objects.create(
            user=self.user,
            asset=self.asset,
            order_type=Order.OrderType.LIMIT,
            side=Order.OrderSide.SELL,
            quantity=2,
            limit_price=Decimal("140"),
        )
        holding = Holding.objects.create(user=self.user, asset=self.asset, quantity=2, avg_cost_basis=Decimal("100"))
        with mock.patch("trading.services.pricing.get_price", return_value=Decimal("130")):
            matching.process_open_orders()
        order.refresh_from_db()
        self.assertEqual(order.status, Order.OrderStatus.OPEN)
        with mock.patch("trading.services.pricing.get_price", return_value=Decimal("145")):
            matching.process_open_orders()
        order.refresh_from_db()
        self.assertEqual(order.status, Order.OrderStatus.FILLED)
