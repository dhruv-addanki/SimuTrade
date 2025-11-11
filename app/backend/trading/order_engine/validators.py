from __future__ import annotations

from decimal import Decimal

from rest_framework.exceptions import ValidationError

from ..models import Holding, Order


def _expected_price(order_type: str, limit_price, market_price: Decimal) -> Decimal:
    if order_type == Order.OrderType.LIMIT and limit_price:
        return Decimal(limit_price)
    return Decimal(market_price)


def validate_order_request(*, user, asset, order_type: str, side: str, quantity: int, limit_price, market_price: Decimal) -> None:
    if quantity <= 0:
        raise ValidationError("Quantity must be positive")

    est_price = _expected_price(order_type, limit_price, market_price)
    notional = est_price * Decimal(quantity)

    if side == Order.OrderSide.BUY:
        balance = user.profile.current_balance
        if balance < notional:
            raise ValidationError("Insufficient balance for this order")
    else:
        holding = Holding.objects.filter(user=user, asset=asset).first()
        if not holding or holding.quantity < quantity:
            raise ValidationError("Insufficient shares to sell")


def ensure_cancelable(order: Order) -> None:
    if order.status not in (Order.OrderStatus.OPEN, Order.OrderStatus.PARTIALLY_FILLED):
        raise ValidationError("Order cannot be cancelled")
