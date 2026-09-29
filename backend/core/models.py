from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Dish(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='dishes'
    )
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='dishes/', blank=True, null=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Table(models.Model):
    number = models.PositiveIntegerField(unique=True)
    capacity = models.PositiveIntegerField(default=4)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Table {self.number}"


class Order(models.Model):
    STATUS = [
        ('pending', 'En attente'),
        ('preparing', 'En préparation'),
        ('served', 'Servie'),
        ('paid', 'Payée'),
    ]

    table = models.ForeignKey(
        Table,
        on_delete=models.PROTECT
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total(self):
        return sum(
            item.dish.price * item.quantity
            for item in self.items.all()
        )


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.PROTECT
    )
    quantity = models.PositiveIntegerField(default=1)