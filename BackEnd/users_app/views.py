from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenJwtSerializer,RegisterSerializer,VerifyOTPSerializer
from rest_framework import generics,status,views
from rest_framework.permissions import AllowAny
from .models import CustomUser
import random
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
class CustomTokenjwtView(TokenObtainPairView):
    serializer_class=CustomTokenJwtSerializer
    
class RegisterView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
    
        existing_user = CustomUser.objects.filter(email=email).first()
        
        if existing_user:
            if not existing_user.is_active:
                otp_code = str(random.randint(100000, 999999))
                existing_user.otp = otp_code
                existing_user.save()
                
                send_mail(
                    'XenFit Verification Code',
                    f'Your OTP code is: {otp_code}',
                    settings.EMAIL_HOST_USER,
                    [existing_user.email],
                    fail_silently=False,
                )
                return Response({"message": "User exists but unverified. New OTP sent."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            otp_code = str(random.randint(100000, 999999))
            user.otp = otp_code
            user.save()

            send_mail(
                'XenFit Verification Code',
                f'Your OTP code is: {otp_code}',
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny,]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = CustomUser.objects.get(email=email)
                if user.otp == otp:
                    user.is_active = True
                    user.otp = None
                    user.save()
                    
                    refresh = RefreshToken.for_user(user)
          
                    return Response({
                        'message': 'Account verified successfully!',
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'mobile': user.mobile
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)