from django.urls import path

from .views import (
    MarketPriceView,
    MarketSearchView,
    OpenOrdersView,
    OrderCancelView,
    OrderCreateView,
    OrderHistoryView,
    PortfolioHoldingsView,
    PortfolioPnlView,
    PortfolioSummaryView,
    TradesByOrderView,
    TransactionListView,
)

urlpatterns = [
    path("market/price/<str:symbol>", MarketPriceView.as_view(), name="market-price"),
    path("market/search", MarketSearchView.as_view(), name="market-search"),
    path("orders/create", OrderCreateView.as_view(), name="orders-create"),
    path("orders/open", OpenOrdersView.as_view(), name="orders-open"),
    path("orders/history", OrderHistoryView.as_view(), name="orders-history"),
    path("orders/cancel/<int:order_id>", OrderCancelView.as_view(), name="orders-cancel"),
    path("portfolio/summary", PortfolioSummaryView.as_view(), name="portfolio-summary"),
    path("portfolio/holdings", PortfolioHoldingsView.as_view(), name="portfolio-holdings"),
    path("portfolio/pnl", PortfolioPnlView.as_view(), name="portfolio-pnl"),
    path("trades/<int:order_id>", TradesByOrderView.as_view(), name="trades-by-order"),
    path("transactions", TransactionListView.as_view(), name="transactions"),
]
