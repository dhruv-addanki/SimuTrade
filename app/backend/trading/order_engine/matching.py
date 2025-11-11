from __future__ import annotations

from decimal import Decimal

from django.db import transaction

from ..models import Order
from ..services import pricing
from .fills import apply_fill


def _limit_condition_met(order: Order, last_price: Decimal) -> bool:
    if order.limit_price is None:
        return False
    if order.side == Order.OrderSide.BUY:
        return last_price <= order.limit_price
    return last_price >= order.limit_price


@transaction.atomic
def process_order(order: Order) -> Order:
    if order.status in (Order.OrderStatus.CANCELLED, Order.OrderStatus.FILLED):
        return order

    last_price = pricing.get_price(order.asset.symbol)
    if order.order_type == Order.OrderType.MARKET:
        if order.remaining_quantity > 0:
            apply_fill(order, last_price, order.remaining_quantity)
    elif _limit_condition_met(order, last_price) and order.remaining_quantity > 0:
        apply_fill(order, order.limit_price, order.remaining_quantity)
    return order


def process_open_orders() -> None:
    open_orders = Order.objects.select_related("asset", "user", "user__profile").filter(
        status__in=[Order.OrderStatus.OPEN, Order.OrderStatus.PARTIALLY_FILLED]
    )
    for order in open_orders:
        process_order(order)
