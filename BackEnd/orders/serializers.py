from rest_framework import serializers
from .models import Cart, CartItem,Wishlist,Order,OrderItem
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


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product_id', 'product_title', 'product_image', 'quantity', 'size', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    orderDate = serializers.DateTimeField(source='created_at', format="%Y-%m-%d") 

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_amount', 'orderDate', 
            'name', 'mobile', 'address', 'place', 'pincode',
            'items'
        ]