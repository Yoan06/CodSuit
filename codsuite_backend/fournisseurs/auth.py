from typing import Any, Dict, Optional

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile


class TenantTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        data = super().validate(attrs)

        user = self.user
        tenant_name: Optional[str] = None
        tenant_slug: Optional[str] = None

        try:
            profile: Optional[UserProfile] = getattr(user, "profile", None)
            if profile and profile.tenant:
                tenant_name = profile.tenant.name
                tenant_slug = profile.tenant.slug
        except Exception:
            # If profile lookup fails for any reason, we still return tokens
            tenant_name = None
            tenant_slug = None

        data.update(
            {
                "user": {
                    "id": user.id,
                    "username": user.get_username(),
                    "email": getattr(user, "email", "") or "",
                    "is_active": bool(getattr(user, "is_active", True)),
                },
                "tenant": {
                    "name": tenant_name,
                    "slug": tenant_slug,
                },
            }
        )

        return data


class TenantTokenObtainPairView(TokenObtainPairView):
    serializer_class = TenantTokenObtainPairSerializer


