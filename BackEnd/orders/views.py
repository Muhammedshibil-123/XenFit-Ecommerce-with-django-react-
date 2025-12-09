from django.shortcuts import render
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem,Wishlist
from .serializers import CartSerializer, CartItemSerializer,WishlistSerializer
from products.models import Product, ProductSize

# Create your views here.
class CartView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        size = request.data.get('size') 
        
        if not product_id:
            return Response({"error": "Product ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product, 
            size=size, 
            defaults={'quantity': 1}
        )

        if not item_created:
            cart_item.quantity += 1
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateCartItemView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        new_size = request.data.get('size')
        new_quantity = request.data.get('quantity')

        if new_size is not None:
            if new_size == "": 
                 cart_item.size = None
            else:
                try:
                    p_size = ProductSize.objects.get(product=cart_item.product, size=new_size)
                    if p_size.stock < cart_item.quantity:
                         return Response({"error": f"Only {p_size.stock} items available in {new_size}"}, status=status.HTTP_400_BAD_REQUEST)
                    cart_item.size = new_size
                except ProductSize.DoesNotExist:
                    return Response({"error": "Invalid size"}, status=status.HTTP_400_BAD_REQUEST)

        if new_quantity is not None:
            new_quantity = int(new_quantity)
            if new_quantity < 1:
                return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)
            
            if cart_item.size:
                p_size = ProductSize.objects.get(product=cart_item.product, size=cart_item.size)
                if new_quantity > p_size.stock:
                    return Response({"error": f"Out of stock. Only {p_size.stock} available."}, status=status.HTTP_400_BAD_REQUEST)
            
            cart_item.quantity = new_quantity

        cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        

class WishlistView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist

class ToggleWishlistView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "Product ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
            
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        
        if wishlist.products.filter(id=product_id).exists():
            wishlist.products.remove(product)
            message = "Removed from wishlist"
            action = "removed"
        else:
            wishlist.products.add(product)
            message = "Added to wishlist"
            action = "added"
            
        return Response({"message": message, "action": action}, status=status.HTTP_200_OK)