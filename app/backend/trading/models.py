from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import models


class Asset(models.Model):
    class AssetType(models.TextChoices):
        EQUITY = "EQUITY", "Equity"
        ETF = "ETF", "ETF"
        CRYPTO = "CRYPTO", "Crypto"

    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=128)
    asset_type = models.CharField(max_length=16, choices=AssetType.choices, default=AssetType.EQUITY)
    last_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal("0"))
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.symbol}"


class Order(models.Model):
    class OrderType(models.TextChoices):
        MARKET = "MARKET", "Market"
        LIMIT = "LIMIT", "Limit"

    class OrderSide(models.TextChoices):
        BUY = "BUY", "Buy"
        SELL = "SELL", "Sell"

    class OrderStatus(models.TextChoices):
        OPEN = "OPEN", "Open"
        PARTIALLY_FILLED = "PARTIALLY_FILLED", "Partially Filled"
        FILLED = "FILLED", "Filled"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="orders")
    order_type = models.CharField(max_length=10, choices=OrderType.choices)
    side = models.CharField(max_length=4, choices=OrderSide.choices)
    quantity = models.PositiveIntegerField()
    limit_price = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.OPEN)
    filled_quantity = models.PositiveIntegerField(default=0)
    average_fill_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal("0"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def remaining_quantity(self) -> int:
        return max(self.quantity - self.filled_quantity, 0)

    def __str__(self) -> str:
        return f"{self.user} {self.side} {self.quantity} {self.asset.symbol}"


class Trade(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="trades")
    fill_price = models.DecimalField(max_digits=12, decimal_places=4)
    quantity = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Trade {self.order_id} x {self.quantity}"


class Holding(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="holdings")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="holdings")
    quantity = models.PositiveIntegerField(default=0)
    avg_cost_basis = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal("0"))

    class Meta:
        unique_together = ("user", "asset")

    def __str__(self) -> str:
        return f"{self.user} - {self.asset.symbol}"

    @property
    def market_value(self) -> Decimal:
        return Decimal(self.quantity) * self.asset.last_price


class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        DEBIT = "DEBIT", "Debit"
        CREDIT = "CREDIT", "Credit"
        TRADE = "TRADE", "Trade"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
    type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user} {self.type} {self.amount}"
