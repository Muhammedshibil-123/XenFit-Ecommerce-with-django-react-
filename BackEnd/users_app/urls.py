from django.urls import path
from .views import RegisterView,VerifyOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verfiy-otp/',VerifyOTPView.as_view(),name='verfiy-otp'),
]