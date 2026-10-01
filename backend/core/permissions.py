from rest_framework.permissions import BasePermission, SAFE_METHODS

def has_role(user, *roles):
    return user.is_authenticated and (
        user.is_superuser or user.groups.filter(name__in=roles).exists()
    )

class AdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return has_role(request.user, 'admin')

class IsStaffRole(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, 'admin', 'waiter', 'cook')