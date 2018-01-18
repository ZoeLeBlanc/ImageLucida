from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, file_model, tag_model

class Image_File(models.Model):
    ''' The Image File class is a model that defines which data is available in the Image File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    file_item = models.ForeignKey(file_model.File, null=True, on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    image_file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    image_file = models.ImageField(upload_to='image-files/', null=True, max_length=2000)
    image_file_name =models.CharField( blank=True, null=True, max_length=2000)
    tags = models.ManyToManyField('Tag', through='Image_File_Tag')
    tesseract_processed = models.BooleanField(default=False)
    google_vision_processed = models.BooleanField(default=False)
    date_updated = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return '%s' % (self.id)

    @property
    def file_url(self):
        if self.image_file and hasattr(self.image_file, 'url'):
            return self.image_file.url

class Image_File_Tag(models.Model):
    ''' The Image File Tag class is a model that defines which data is available in the Image Tag File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='image_file_tag')
    image_file = models.ForeignKey(Image_File, null=True, related_name='image_file_tag')

    def __str__(self):
        return '%s' % (self.id)
