from rest_framework import serializers
from .models import Product, ProductSize, ProductImage

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'stock']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(many=True, read_only=True)
    extra_images = ProductImageSerializer(many=True, read_only=True)
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_available_colors(self, obj):
        variants = Product.objects.filter(product_code=obj.product_code,status='active').exclude(id=obj.id)
        return [
            {
                "id": v.id, 
                "color": v.color, 
                "image": v.image.url if v.image else None 
            } 
            for v in variants
        ]