from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model

class BaseFile(models.Model):
    ''' The Base File class is a model that defines which data is available in the Base File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1, null=True)
    base_file_name = models.CharField(max_length=2000, blank=True, null=True)
    base_file = models.ImageField(upload_to='files/', max_length=2000)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    base_file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    transformed = models.BooleanField(default=False)
    assigned = models.BooleanField(default=False)
    height = models.IntegerField(null=True, default=0)
    width = models.IntegerField(null=True, default=0)
    date_updated = models.DateTimeField(auto_now=True, null=True)
    upload_file = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name="base_upload_file")
    transformed_file = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name="base_transformed_file")
    tesseract_processed = models.BooleanField(default=False)
    google_vision_processed = models.BooleanField(default=False)
    auto_image_processed = models.BooleanField(default=False)
    manual_image_processed = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.id)

    @property
    def file_url(self):
        if self.base_file and hasattr(self.base_file, 'url'):
            return self.base_file.url
