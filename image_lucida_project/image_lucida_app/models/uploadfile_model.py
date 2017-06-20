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
    upload_file = models.ImageField(upload_to='upload-files/')
    date_created = models.DateTimeField(auto_now_add=True)
    upload_file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    transformed = models.BooleanField(default=False)
    height = models.IntegerField(null=True, default=0)
    width = models.IntegerField(null=True, default=0)

    def __str__(self):
        return '%s' % (self.upload_file_name)

    @property
    def file_url(self):
        if self.upload_file and hasattr(self.upload_file, 'url'):
            return self.upload_file.url