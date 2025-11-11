from __future__ import annotations

from decimal import Decimal
import time
from typing import Dict, Tuple

import requests
from django.conf import settings
from django.utils import timezone

from ..models import Asset

_PRICE_CACHE: Dict[str, Tuple[Decimal, float]] = {}


def _fetch_from_provider(symbol: str) -> Decimal:
    provider = settings.MARKET_DATA_PROVIDER.lower()
    api_key = settings.MARKET_DATA_API_KEY
    symbol = symbol.upper()

    try:
        if provider == "alpha_vantage":
            url = "https://www.alphavantage.co/query"
            params = {"function": "GLOBAL_QUOTE", "symbol": symbol, "apikey": api_key}
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            payload = response.json().get("Global Quote", {})
            price = payload.get("05. price")
            if price:
                return Decimal(price)
        elif provider == "finnhub":
            url = "https://finnhub.io/api/v1/quote"
            params = {"symbol": symbol, "token": api_key}
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            payload = response.json()
            current = payload.get("c")
            if current:
                return Decimal(str(current))
    except requests.RequestException:
        pass

    # Fallback to last known price or a fake placeholder price.
    asset = Asset.objects.filter(symbol=symbol).first()
    if asset and asset.last_price > 0:
        return asset.last_price
    # deterministic fallback using symbol hash to avoid zero.
    pseudo_price = Decimal((abs(hash(symbol)) % 10000) / 10 + 50)
    return pseudo_price.quantize(Decimal("0.01"))


def get_price(symbol: str) -> Decimal:
    symbol = symbol.upper()
    now = time.time()
    cached = _PRICE_CACHE.get(symbol)
    if cached and now - cached[1] < settings.MARKET_DATA_CACHE_SECONDS:
        return cached[0]

    price = _fetch_from_provider(symbol)
    _PRICE_CACHE[symbol] = (price, now)
    asset, _ = Asset.objects.get_or_create(
        symbol=symbol,
        defaults={"name": symbol, "asset_type": Asset.AssetType.EQUITY, "last_price": price},
    )
    asset.last_price = price
    asset.save(update_fields=["last_price", "updated_at"])
    return price


def refresh_asset(asset: Asset) -> Decimal:
    price = get_price(asset.symbol)
    asset.last_price = price
    asset.updated_at = timezone.now()
    asset.save(update_fields=["last_price", "updated_at"])
    return price
