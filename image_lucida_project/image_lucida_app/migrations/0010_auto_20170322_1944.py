# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-22 19:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0009_auto_20170321_1053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='upload_file',
            name='upload_file',
            field=models.ImageField(upload_to='/upload-files/'),
        ),
    ]
