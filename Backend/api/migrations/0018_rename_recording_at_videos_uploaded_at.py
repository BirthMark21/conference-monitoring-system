# Generated by Django 5.0.4 on 2024-06-10 20:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_remove_speaker_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videos',
            old_name='Recording_at',
            new_name='uploaded_at',
        ),
    ]
