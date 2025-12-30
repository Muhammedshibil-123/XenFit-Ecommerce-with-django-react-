from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.views import APIView
from .models import Product,ProductSize,ProductImage
from .serializers import ProductSerializer,ProductSizeSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# Create your views here.
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        product = serializer.save()
       
        gallery_images = self.request.FILES.getlist('gallery')
        for img in gallery_images:
            ProductImage.objects.create(product=product, image=img)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def perform_update(self, serializer):
        product = serializer.save()
        
        
        gallery_images = self.request.FILES.getlist('gallery')
        for img in gallery_images:
            ProductImage.objects.create(product=product, image=img)

class ProductStockView(APIView):
    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
            sizes = product.sizes.all()
            serializer = ProductSizeSerializer(sizes, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, id):
        try:
            product = Product.objects.get(id=id)
            data = request.data 
            
            for item in data:
                size_code = item.get('size')
                stock_count = item.get('stock')
                if size_code:
                    ProductSize.objects.update_or_create(
                        product=product,
                        size=size_code,
                        defaults={'stock': stock_count or 0}
                    )
            product_serializer = ProductSerializer(product, context={'request': request})
            return Response(product_serializer.data, status=status.HTTP_200_OK)
            
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)