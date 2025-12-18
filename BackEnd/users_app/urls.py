from django.urls import path
from .views import RegisterView,VerifyOTPView,GoogleLoginView,UserListView,UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),

    path('', UserListView.as_view(), name='user-list'),         
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail')
]