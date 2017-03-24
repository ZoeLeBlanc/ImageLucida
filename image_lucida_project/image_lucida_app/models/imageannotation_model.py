from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, transformfile_model, tag_model
from image_lucida_app.helpers import UniqueFileName

class Image_Annotation(models.Model):
    ''' The Text Annotation class is a model that defines which data is available in the Text Annotation table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    transform_file = models.ForeignKey(transformfile_model.Transform_File, null=True, on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    image_annotation_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    image_annotation_file = models.ImageField(upload_to=UniqueFileName('image-annotations/'), null=True)
    image_annotation_file_name =models.CharField(max_length=200, blank=True)
    cover = models.BooleanField(default=False)
    cover_image = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', through='Image_Annotation_Tag')
    processed = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.id)

class Image_Annotation_Tag(models.Model):
    ''' The Image Annotation Tag class is a model that defines which data is available in the Image Tag Annotation table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='image_annotation_tag')
    image_annotation = models.ForeignKey(Image_Annotation, null=True, related_name='image_annotation_tag')

    def __str__(self):
        return '%s' % (self.id)
