from django.contrib import admin
from django.contrib import admin
from .models import Category, Dish, Table, Order, OrderItem, Reservation

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'available')
    list_filter = ('category', 'available')
    search_fields = ('name',)

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'capacity', 'is_occupied')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'table', 'status', 'created_at', 'total')
    list_filter = ('status',)
    inlines = [OrderItemInline]

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'date', 'time', 'guests', 'status')
    list_filter = ('status', 'date')
    search_fields = ('name', 'phone')
# Register your models here.
