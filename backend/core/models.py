from django.db import models

class category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self) : return self.name 

class Dish(models.Model):
    category = models.ForeignKey(category, on_delete=models.CASCADE, related_name='dishes')
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='dishes/', blank=True, null=True)
    available = models.BooleanField(default=True)
    def __str__(self) : return self.name

class table(models.Model):
    number = models.PositiveIntegerField(unique=True)
    capacity = models.BooleanField(default=4)
    is_occupied = models.BooleanField(default=False)

class Order(models.Model):
    STATUS = [('pending','En attente'),('preparing','En préparation'),
              ('served','Servie'),('paid','Payée')]
    table = models.ForeignKey(table, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total(self):
        return sum(i.dish.price * i.quantity for i in self.items.all())

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

class Reservation(models.Model):
    STATUS = [('pending', 'En attente'), ('confirmed', 'Confirmée'), ('cancelled', 'Annulée')]
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    date = models.DateField()
    time = models.TimeField()
    guests = models.PositiveIntegerField(default=2)
    note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date} {self.time}"


# Create your models here.
