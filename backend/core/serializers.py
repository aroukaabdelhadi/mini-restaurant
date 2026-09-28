from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta: model = Category; fields = '__all__'

class DishSerializer(serializers.ModelSerializer):
    class Meta: model = Dish; fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta: model = Table; fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta: model = OrderItem; fields = ['id', 'dish', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'table', 'status', 'created_at', 'items', 'total']

    def create(self, validated_data):
        items = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item in items:
            OrderItem.objects.create(order=order, **item)
        return order