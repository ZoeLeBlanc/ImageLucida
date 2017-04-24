# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-23 11:46
from __future__ import unicode_literals

from django.db import migrations, models
import image_lucida_app.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0013_auto_20170323_1106'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transform_file',
            name='transform_file',
            field=models.ImageField(upload_to=image_lucida_app.helpers.UniqueFileName('transform-files/')),
        ),
    ]