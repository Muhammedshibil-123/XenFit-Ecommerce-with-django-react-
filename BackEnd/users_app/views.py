from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenJwtSerializer,RegisterSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CustomUser

# Create your views here.
class CustomTokenjwtView(TokenObtainPairView):
    serializer_class=CustomTokenJwtSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset=CustomUser.objects.all()
    permission_classes=(AllowAny)
    serializer_class=RegisterSerializer