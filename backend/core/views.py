from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework import status as http
from django.utils import timezone
from .permissions import AdminOrReadOnly, IsStaffRole


def home(request):
    return JsonResponse({
        'message': 'Restaurant API is running'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        'username': request.user.username,
        'roles': list(request.user.groups.values_list('name', flat=True)),
        'is_superuser': request.user.is_superuser,
    })


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [IsAuthenticated]

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.groups.first().name if user.groups.exists() else 'staff'
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

TRANSITIONS = {
    # role: {current_status: [allowed_next]}
    'cook':   {'pending': ['preparing'], 'preparing': ['served']},
    'waiter': {'served': ['paid'], 'pending': ['preparing']},
}

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def set_status(self, request, pk=None):
        order = self.get_object()
        new = request.data.get('status')
        user = request.user

        if not user.is_superuser:
            roles = user.groups.values_list('name', flat=True)
            allowed = set()
            for r in roles:
                allowed |= set(TRANSITIONS.get(r, {}).get(order.status, []))
            if new not in allowed:
                return Response({'detail': 'Non autorisé'}, status=http.HTTP_403_FORBIDDEN)

        order.status = new
        order.save()

        if new == 'paid':                       # 7rrer la table
            order.table.is_occupied = False
            order.table.save()

        return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    today = timezone.localdate()
    todays = Order.objects.filter(created_at__date=today)
    paid = todays.filter(status='paid')
    return Response({
        'revenue_today': sum(o.total for o in paid),
        'orders_today': todays.count(),
        'active_orders': Order.objects.exclude(status='paid').count(),
        'occupied_tables': Table.objects.filter(is_occupied=True).count(),
        'total_tables': Table.objects.count(),
    })



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AdminOrReadOnly]


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [AdminOrReadOnly]


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [AdminOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsStaffRole]



    from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def public_menu(request):
    categories = Category.objects.prefetch_related('dishes').all()
    data = []
    for cat in categories:
        dishes = cat.dishes.filter(available=True)
        data.append({
            'id': cat.id,
            'name': cat.name,
            'dishes': [
                {'id': d.id, 'name': d.name, 'price': str(d.price),
                 'image': request.build_absolute_uri(d.image.url) if d.image else None}
                for d in dishes
            ]
        })
    return Response(data)

# Create your views here.
