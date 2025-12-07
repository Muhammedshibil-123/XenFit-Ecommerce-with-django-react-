from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenJwtSerializer

# Create your views here.
class CustomTokenjwtView(TokenObtainPairView):
    serializer_class=CustomTokenJwtSerializer
    