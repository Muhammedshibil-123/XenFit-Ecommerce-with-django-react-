from rest_framework import serializers
from .models import Cart, CartItem,Wishlist
from products.models import Product, ProductSize
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    max_stock = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'size', 'max_stock']

    def get_max_stock(self, obj):
        if obj.size:
            try:
                size_obj = ProductSize.objects.get(product=obj.product, size=obj.size)
                return size_obj.stock
            except ProductSize.DoesNotExist:
                return 0
        return 0

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products']