from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenJwtSerializer,RegisterSerializer,VerifyOTPSerializer,UserSerializer
from rest_framework import generics,status,views
from rest_framework.permissions import AllowAny,IsAdminUser, IsAuthenticated
from .models import CustomUser
import random
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets
import string
import requests

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
    

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        google_token = request.data.get('token')
        if not google_token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

        user_info_req = requests.get(f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={google_token}')
        
        if not user_info_req.ok:
             return Response({'error': 'Invalid Google Token'}, status=status.HTTP_400_BAD_REQUEST)
        
        idinfo = user_info_req.json()
        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
          
            random_suffix = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(4))
            username = f"{email.split('@')[0]}_{random_suffix}"
            
            user = CustomUser.objects.create(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
                role='user',  
                is_active=True
            )
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        refresh['username'] = user.username

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'mobile': user.mobile
        }, status=status.HTTP_200_OK)
    

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]