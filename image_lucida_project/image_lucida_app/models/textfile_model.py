from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, file_model, tag_model, imagefile_model
from image_lucida_app.helpers import UniqueFileName

class Text_File(models.Model):
    ''' The Text File class is a model that defines which data is available in the Text File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    image_file = models.ForeignKey(imagefile_model.Image_File, null=True, on_delete=models.CASCADE, blank=True)
    file_item = models.ForeignKey(file_model.File, null=True, on_delete=models.CASCADE, blank=True)
    text_file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    tesseract_text = models.TextField(blank=True)
    google_vision_text = models.TextField(blank=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s' % (self.id)
