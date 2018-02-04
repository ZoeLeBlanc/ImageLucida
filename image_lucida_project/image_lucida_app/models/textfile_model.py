from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from . import basefile_model
from image_lucida_app.helpers import UniqueFileName

class Text_File(models.Model):
    ''' The Text File class is a model that defines which data is available in the Text File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    base_file = models.ForeignKey(basefile_model.Base_File, null=True, on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    tesseract_text = models.TextField(blank=True, null=True)
    google_vision_text = models.TextField(blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True, null=True)
    tesseract_response=JSONField(null=True)
    google_vision_response=JSONField(null=True)
    google_vision_document_response=JSONField(null=True)

    def __str__(self):
        return '%s' % (self.id)
