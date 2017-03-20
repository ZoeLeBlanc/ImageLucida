from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model

class Upload_File(models.Model):
    ''' The Upload File class is a model that defines which data is available in the Upload File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    upload_file_name = models.CharField(max_length=200, blank=True)
    upload_file = models.FileField(upload_to='/upload-files/')
    date_created = models.DateTimeField(auto_now_add=True)
    upload_file_coordinates = models.OneToOneField(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    transformed = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.upload_file_name)