# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-20 00:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0037_remove_transform_file_cover_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='image_annotation',
            name='date_updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='text_annotation',
            name='date_updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='transform_file',
            name='date_updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='folder',
            name='date_updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
