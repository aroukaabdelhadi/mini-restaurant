from django.db import models

class category(models.Model):
    name = models.charfield(max_length=100)
    def __str__(self) : return self.name 

class Dish(models.Model):
    category = models.Foreignkey(category, on_delete=models.cascade, related_name='dishes')
    name = models.charfield(max_length=150)
    price = models.decimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='dishes/', blank=True, null=True)
    available = models.BooleanField(default=True)
    def __str__(self) : return self.name

class table(models.Model):
    number = models.positiveIntegerField(unique=True)
    capacity = models.BooleanField(default=4)
    is_occupied = models.BooleanField(default=False)

class Order(models.Model):
    STATUS = [('pending','En attente'),('preparing','En préparation'),
              ('served','Servie'),('paid','Payée')]
    table = models.ForeignKey(Table, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total(self):
        return sum(i.dish.price * i.quantity for i in self.items.all())

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

cd

# Create your models here.
