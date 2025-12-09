from django.contrib import admin
from .models import Product, ProductSize, ProductImage


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1  
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'product_code', 'color', 'price', 'brand', 'total_stock')
    list_filter = ('brand', 'theme', 'color', 'sleeve_type')
    search_fields = ('title', 'product_code', 'brand')
    
    inlines = [ProductSizeInline, ProductImageInline]
    def total_stock(self, obj):
        return sum(item.stock for item in obj.sizes.all())

admin.site.register(Product, ProductAdmin)