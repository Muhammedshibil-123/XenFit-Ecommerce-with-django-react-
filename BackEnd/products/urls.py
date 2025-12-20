from django.urls import path
from .views import ProductListCreateView,ProductDetailView,ProductStockView

urlpatterns = [
    path('',ProductListCreateView.as_view(),name='product_list_create'),
    path('<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:id>/stock/', ProductStockView.as_view(), name='product-stock'),
]
