from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.views import APIView
from .models import Product,ProductSize
from .serializers import ProductSerializer,ProductSizeSerializer
from rest_framework.response import Response

# Create your views here.
class ProductListCreateView(generics.ListCreateAPIView):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'

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