from __future__ import annotations

from decimal import Decimal
from typing import Dict

from django.db import transaction

from accounts.models import Profile
from ..models import Holding


def calculate_holdings_value(user) -> Decimal:
    total = Decimal("0")
    for holding in Holding.objects.filter(user=user).select_related("asset"):
        total += holding.market_value
    return total.quantize(Decimal("0.01")) if total else Decimal("0.00")


def calculate_total_value(user) -> Decimal:
    profile: Profile = user.profile
    holdings_value = calculate_holdings_value(user)
    return (holdings_value + profile.current_balance).quantize(Decimal("0.01"))


def calculate_pnl(user) -> Dict[str, Decimal]:
    profile: Profile = user.profile
    holdings_value = calculate_holdings_value(user)
    total_value = holdings_value + profile.current_balance
    total_pnl = total_value - profile.starting_balance
    return {
        "realized": profile.total_pnl.quantize(Decimal("0.01")),
        "unrealized": (total_pnl - profile.total_pnl).quantize(Decimal("0.01")),
        "total": total_pnl.quantize(Decimal("0.01")),
    }


def update_total_pnl(user, realized_delta: Decimal) -> None:
    profile: Profile = user.profile
    with transaction.atomic():
        profile.total_pnl = (profile.total_pnl + realized_delta).quantize(Decimal("0.01"))
        profile.save(update_fields=["total_pnl", "updated_at"])
