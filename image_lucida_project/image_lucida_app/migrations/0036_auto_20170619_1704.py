# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-19 17:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0035_auto_20170619_1557'),
    ]

    operations = [
        migrations.AddField(
            model_name='upload_file',
            name='height',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='upload_file',
            name='width',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
