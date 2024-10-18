from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EventUser, Speaker

@receiver(post_save, sender=EventUser)
def create_speaker_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'speaker':
        Speaker.objects.create(
            user=instance,
            fullname=instance.fullname,
            email=instance.email,
            phone_number=instance.phone_number
        )
