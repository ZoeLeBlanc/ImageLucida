# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-21 10:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0008_auto_20170320_1548'),
    ]

    operations = [
        migrations.AlterField(
            model_name='upload_file',
            name='upload_file',
            field=models.FileField(upload_to='/upload-files/'),
        ),
    ]
