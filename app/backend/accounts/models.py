from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    starting_balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("100000.00"))
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("100000.00"))
    total_pnl = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Profile({self.user.username})"

    @property
    def cash_available(self) -> Decimal:
        return self.current_balance


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance: User, created: bool, **_: object) -> None:
    if created:
        Profile.objects.create(user=instance)
    else:
        Profile.objects.get_or_create(user=instance)
