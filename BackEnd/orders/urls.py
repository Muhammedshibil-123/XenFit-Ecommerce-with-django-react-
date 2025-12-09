from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView,WishlistView,ToggleWishlistView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/item/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/toggle/', ToggleWishlistView.as_view(), name='toggle-wishlist'),
]