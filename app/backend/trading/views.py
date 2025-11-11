from __future__ import annotations

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Asset, Holding, Order, Trade, Transaction
from .order_engine import matching, validators
from .serializers import (
    AssetSerializer,
    HoldingSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    PortfolioPnlSerializer,
    PortfolioSummarySerializer,
    TradeSerializer,
    TransactionSerializer,
)
from .services import pricing as pricing_service


class MarketPriceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, symbol: str):
        price = pricing_service.get_price(symbol)
        return Response({"symbol": symbol.upper(), "price": price})


class MarketSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q", "")
        qs = Asset.objects.all()
        if query:
            qs = qs.filter(Q(symbol__icontains=query) | Q(name__icontains=query))
        serializer = AssetSerializer(qs[:25], many=True)
        return Response(serializer.data)


class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        asset = serializer.validated_data["asset"]
        order_type = serializer.validated_data["order_type"]
        side = serializer.validated_data["side"]
        quantity = serializer.validated_data["quantity"]
        limit_price = serializer.validated_data.get("limit_price")
        market_price = pricing_service.get_price(asset.symbol)
        validators.validate_order_request(
            user=request.user,
            asset=asset,
            order_type=order_type,
            side=side,
            quantity=quantity,
            limit_price=limit_price,
            market_price=market_price,
        )
        order = serializer.save()
        matching.process_order(order)
        order.refresh_from_db()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OpenOrdersView(APIView):
    def get(self, request):
        qs = Order.objects.filter(user=request.user, status__in=[Order.OrderStatus.OPEN, Order.OrderStatus.PARTIALLY_FILLED])
        serializer = OrderSerializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data)


class OrderHistoryView(APIView):
    def get(self, request):
        qs = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(qs, many=True)
        return Response(serializer.data)


class OrderCancelView(APIView):
    def post(self, request, order_id: int):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        validators.ensure_cancelable(order)
        order.status = Order.OrderStatus.CANCELLED
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)


class PortfolioSummaryView(APIView):
    def get(self, request):
        data = PortfolioSummarySerializer.build(request.user)
        serializer = PortfolioSummarySerializer(data)
        return Response(serializer.data)


class PortfolioHoldingsView(APIView):
    def get(self, request):
        holdings = Holding.objects.filter(user=request.user).select_related("asset")
        serializer = HoldingSerializer(holdings, many=True)
        return Response(serializer.data)


class PortfolioPnlView(APIView):
    def get(self, request):
        data = PortfolioPnlSerializer.build(request.user)
        serializer = PortfolioPnlSerializer(data)
        return Response(serializer.data)


class TradesByOrderView(APIView):
    def get(self, request, order_id: int):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = TradeSerializer(order.trades.all(), many=True)
        return Response(serializer.data)


class TransactionListView(APIView):
    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by("-timestamp")
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
