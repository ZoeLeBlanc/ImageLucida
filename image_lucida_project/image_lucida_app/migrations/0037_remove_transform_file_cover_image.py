# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-20 00:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0036_auto_20170619_1704'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transform_file',
            name='cover_image',
        ),
    ]
