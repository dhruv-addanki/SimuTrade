from __future__ import annotations

from decimal import Decimal

from django.db import transaction

from accounts.models import Profile
from ..models import Holding, Order, Trade, Transaction
from ..services import portfolio as portfolio_service


@transaction.atomic
def apply_fill(order: Order, fill_price: Decimal, quantity: int) -> Trade:
    if quantity <= 0 or order.remaining_quantity <= 0:
        raise ValueError("Invalid quantity for fill")

    quantity = min(quantity, order.remaining_quantity)
    fill_price = Decimal(fill_price)
    trade = Trade.objects.create(order=order, fill_price=fill_price, quantity=quantity)

    notional = fill_price * Decimal(quantity)
    profile: Profile = order.user.profile
    holding, _ = Holding.objects.select_for_update().get_or_create(user=order.user, asset=order.asset)

    if order.side == Order.OrderSide.BUY:
        total_shares = holding.quantity + quantity
        if total_shares > 0:
            new_cost = (holding.avg_cost_basis * Decimal(holding.quantity)) + notional
            holding.avg_cost_basis = new_cost / Decimal(total_shares)
        holding.quantity = total_shares
        holding.save(update_fields=["quantity", "avg_cost_basis"])
        profile.current_balance = profile.current_balance - notional
        Transaction.objects.create(user=order.user, type=Transaction.TransactionType.DEBIT, amount=notional, reason=f"BUY {order.asset.symbol}")
        realized = Decimal("0")
    else:
        if quantity > holding.quantity:
            raise ValueError("Cannot sell more than holding")
        holding.quantity -= quantity
        cost_basis = holding.avg_cost_basis * Decimal(quantity)
        realized = (fill_price * Decimal(quantity)) - cost_basis
        if holding.quantity == 0:
            holding.avg_cost_basis = Decimal("0")
        holding.save(update_fields=["quantity", "avg_cost_basis"])
        profile.current_balance = profile.current_balance + notional
        Transaction.objects.create(user=order.user, type=Transaction.TransactionType.CREDIT, amount=notional, reason=f"SELL {order.asset.symbol}")
        Transaction.objects.create(user=order.user, type=Transaction.TransactionType.TRADE, amount=realized, reason="Realized PnL")

    profile.save(update_fields=["current_balance", "updated_at"])

    filled_total = order.filled_quantity + quantity
    order.average_fill_price = ((order.average_fill_price * Decimal(order.filled_quantity)) + (fill_price * Decimal(quantity))) / Decimal(filled_total)
    order.filled_quantity = filled_total
    order.status = Order.OrderStatus.FILLED if order.remaining_quantity == 0 else Order.OrderStatus.PARTIALLY_FILLED
    order.save(update_fields=["average_fill_price", "filled_quantity", "status", "updated_at"])

    if realized:
        portfolio_service.update_total_pnl(order.user, realized)

    return trade
