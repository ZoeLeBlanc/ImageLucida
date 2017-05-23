from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, transformfile_model, tag_model
from image_lucida_app.helpers import UniqueFileName

class Text_Annotation(models.Model):
    ''' The Text Annotation class is a model that defines which data is available in the Text Annotation table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    transform_file = models.ForeignKey(transformfile_model.Transform_File, null=True, on_delete=models.CASCADE, blank=True)
    text_annotation_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    article_title = models.CharField(max_length=200, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    tesseract_text_annotation = models.TextField(blank=True)
    google_vision_text_annotation = models.TextField(blank=True)
    cover = models.BooleanField(default=False)
    cover_story = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', through='Text_Annotation_Tag')
    tesseract_processed = models.BooleanField(default=False)
    google_vision_processed = models.BooleanField(default=False)
    text_annotation_file = models.ImageField(upload_to=UniqueFileName('text-annotations/'), blank=True)

    def __str__(self):
        return '%s' % (self.id)

class Text_Annotation_Tag(models.Model):
    ''' The Text Annotation Tag class is a model that defines which data is available in the Text Tag Annotation table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='text_annotation_tag')
    text_annotation = models.ForeignKey(Text_Annotation, null=True, related_name='text_annotation_tag')

    def __str__(self):
        return '%s' % (self.id)

