from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from fournisseurs.models import Tenant, UserProfile


class Command(BaseCommand):
    help = "Create a tenant and an associated user profile. Usage: --tenant <name> --slug <slug> --username <u> --password <p> [--email <e>]"

    def add_arguments(self, parser):
        parser.add_argument("--tenant", required=True, help="Tenant name")
        parser.add_argument("--slug", required=True, help="Tenant slug")
        parser.add_argument("--username", required=True, help="Username to create or update")
        parser.add_argument("--password", required=True, help="Password for the user")
        parser.add_argument("--email", default="", help="Optional email")

    def handle(self, *args, **options):
        tenant_name = options["tenant"]
        tenant_slug = options["slug"]
        username = options["username"]
        password = options["password"]
        email = options["email"]

        User = get_user_model()

        tenant, _ = Tenant.objects.get_or_create(name=tenant_name, slug=tenant_slug)
        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "is_active": True},
        )
        if not created:
            # Ensure active and email are up to date
            if email and getattr(user, "email", None) != email:
                user.email = email
            if not getattr(user, "is_active", True):
                user.is_active = True
        user.set_password(password)
        user.save()

        UserProfile.objects.get_or_create(user=user, defaults={"tenant": tenant})

        self.stdout.write(self.style.SUCCESS(f"Tenant '{tenant_name}' ready; user '{username}' configured."))


