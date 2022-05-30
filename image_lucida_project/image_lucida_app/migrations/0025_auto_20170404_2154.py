# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-04 21:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_lucida_app', '0024_image_annotation_image_palette_file_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='text_annotation',
            old_name='processed',
            new_name='tesseract_processed',
        ),
        migrations.RenameField(
            model_name='text_annotation',
            old_name='text_annotation',
            new_name='tesseract_text_annotation',
        ),
        migrations.AddField(
            model_name='text_annotation',
            name='google_vision_processed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='text_annotation',
            name='google_vision_text_annotionat',
            field=models.TextField(blank=True),
        ),
    ]
