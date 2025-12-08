from django.db import models

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=200)
    product_code = models.CharField(max_length=50, help_text="Common code for same products with different colors")
    
    color = models.CharField(max_length=50)
    brand = models.CharField(max_length=100)
    CATEGORY_CHOICES = [
        ('Anime', 'Anime'),
        ('Sports', 'Sports'),
        ('Movie', 'Movie'),
        ('Motivational', 'Motivational'),
        ('Minimal', 'Minimal'),
        ('Vintage', 'Vintage'),
    ]
    theme = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    SLEEVE_CHOICES = [
        ('Half Sleeve', 'Half Sleeve'),
        ('Full Sleeve', 'Full Sleeve'),
        ('Sleeveless', 'Sleeveless'),
        ('Oversized', 'Oversized'),
    ]
    sleeve_type = models.CharField(max_length=20, choices=SLEEVE_CHOICES, default='Half Sleeve')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.color})"

class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    SIZE_CHOICES = [
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
    ]
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.title} - {self.size} ({self.stock})"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='extra_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_gallery/')

    def __str__(self):
        return f"Image for {self.product.title}"