from __future__ import annotations

from celery import shared_task

from .models import Asset
from .order_engine import matching
from .services import pricing


@shared_task
def refresh_asset_prices() -> None:
    for asset in Asset.objects.all():
        pricing.refresh_asset(asset)


@shared_task
def process_open_orders() -> None:
    matching.process_open_orders()
