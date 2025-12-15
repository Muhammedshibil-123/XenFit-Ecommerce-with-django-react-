from django.urls import path
from .views import RegisterView,VerifyOTPView,GoogleLoginView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
]