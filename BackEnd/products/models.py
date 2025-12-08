from django.db import models

# Create your models here.
class Product(models.Model):
   

    title = models.CharField(max_length=200)
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
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True) 
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title