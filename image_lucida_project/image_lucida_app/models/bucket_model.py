from django.db import models
from . import folder_model

class Bucket(models.Model):
    ''' The Bucket class is a model that defines which data is available in the Bucket table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    bucket_name = models.CharField(blank=True, null=True, max_length=2000)
    description = models.CharField(max_length=500, blank=True, null=True)
    folder = models.ForeignKey(folder_model.Folder, null=True, on_delete=models.CASCADE, blank=True)


    def natural_key(self):
        return (self.bucket_name, self.description, self.folder)

    def __str__(self):
        return '%s %s %s' % (self.bucket_name, self.description, self.folder)
