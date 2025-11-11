from __future__ import annotations

from decimal import Decimal

from rest_framework import serializers

from accounts.models import Profile
from .models import Asset, Holding, Order, Trade, Transaction
from .services import portfolio as portfolio_service


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ("id", "symbol", "name", "asset_type", "last_price", "updated_at")


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ("id", "order", "fill_price", "quantity", "timestamp")


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("id", "type", "amount", "reason", "timestamp")


class HoldingSerializer(serializers.ModelSerializer):
    market_value = serializers.DecimalField(max_digits=14, decimal_places=4, read_only=True)
    asset_detail = AssetSerializer(source="asset", read_only=True)

    class Meta:
        model = Holding
        fields = ("id", "asset", "asset_detail", "quantity", "avg_cost_basis", "market_value")


class OrderSerializer(serializers.ModelSerializer):
    asset_detail = AssetSerializer(source="asset", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "asset",
            "asset_detail",
            "order_type",
            "side",
            "quantity",
            "limit_price",
            "status",
            "filled_quantity",
            "average_fill_price",
            "created_at",
        )
        read_only_fields = ("status", "filled_quantity", "average_fill_price", "created_at")


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("asset", "order_type", "side", "quantity", "limit_price")

    def validate(self, attrs):
        order_type = attrs.get("order_type")
        limit_price = attrs.get("limit_price")
        if order_type == Order.OrderType.LIMIT and not limit_price:
            raise serializers.ValidationError("Limit orders require limit_price")
        if order_type == Order.OrderType.MARKET:
            attrs["limit_price"] = None
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        return Order.objects.create(user=user, **validated_data)


class PortfolioSummarySerializer(serializers.Serializer):
    total_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    cash = serializers.DecimalField(max_digits=14, decimal_places=2)
    holdings_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_pnl = serializers.DecimalField(max_digits=14, decimal_places=2)

    @staticmethod
    def build(user) -> dict:
        profile: Profile = user.profile
        holdings_value = portfolio_service.calculate_holdings_value(user)
        total_value = holdings_value + profile.current_balance
        return {
            "total_value": total_value,
            "cash": profile.current_balance,
            "holdings_value": holdings_value,
            "total_pnl": profile.total_pnl,
        }


class PortfolioPnlSerializer(serializers.Serializer):
    realized_pnl = serializers.DecimalField(max_digits=14, decimal_places=2)
    unrealized_pnl = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_pnl = serializers.DecimalField(max_digits=14, decimal_places=2)

    @staticmethod
    def build(user) -> dict:
        pnl = portfolio_service.calculate_pnl(user)
        return {
            "realized_pnl": pnl["realized"],
            "unrealized_pnl": pnl["unrealized"],
            "total_pnl": pnl["total"],
        }
