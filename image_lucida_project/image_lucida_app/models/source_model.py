from django.db import models
from django.contrib.auth.models import User
from . import bucket_model

class Source(models.Model):
    ''' The Source class is a model that defines which data is available in the Source table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    source_name = models.TextField(blank=True)
    publication_location = models.CharField(max_length=500, blank=True)
    bucket = models.ForeignKey(bucket_model.Bucket, null=True, on_delete=models.CASCADE, blank=True)

    def natural_key(self):
        return (self.source_name, self.publication_location)

    def __str__(self):
        return '%s %s %s' % (self.source_name, self.publication_location)
