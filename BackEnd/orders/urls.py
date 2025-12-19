from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView,WishlistView,ToggleWishlistView,CreateOrderView,VerifyPaymentView,OrderListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/item/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/toggle/', ToggleWishlistView.as_view(), name='toggle-wishlist'),
    path('place-order/', CreateOrderView.as_view(), name='place-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('my-orders/', OrderListView.as_view(), name='my-orders'),
]