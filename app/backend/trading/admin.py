from django.contrib import admin

from .models import Asset, Holding, Order, Trade, Transaction


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "asset_type", "last_price", "updated_at")
    search_fields = ("symbol", "name")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("user", "asset", "side", "order_type", "quantity", "status", "created_at")
    list_filter = ("status", "side", "order_type")
    search_fields = ("user__username", "asset__symbol")


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ("order", "quantity", "fill_price", "timestamp")


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ("user", "asset", "quantity", "avg_cost_basis")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "amount", "timestamp", "reason")
    list_filter = ("type",)
