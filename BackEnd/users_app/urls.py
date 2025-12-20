from django.urls import path
from .views import RegisterView,VerifyOTPView,GoogleLoginView,UserListView,UserDetailView,ForgotPasswordView,VerifyForgotPasswordOTPView,ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-forgot-otp/', VerifyForgotPasswordOTPView.as_view(), name='verify-forgot-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    path('', UserListView.as_view(), name='user-list'),         
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail')
]