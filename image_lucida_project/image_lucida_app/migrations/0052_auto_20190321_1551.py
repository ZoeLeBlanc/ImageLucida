# Generated by Django 2.0.3 on 2019-03-21 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0051_file_contains_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file_name',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]