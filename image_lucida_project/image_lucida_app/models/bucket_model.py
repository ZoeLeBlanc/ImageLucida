from django.db import models

class Bucket(models.Model):
    ''' The Bucket class is a model that defines which data is available in the Bucket table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    bucket_name = models.CharField(max_length=500, blank=True)
    bucket_type = models.CharField(max_length=500, blank=True, unique=True)


    def natural_key(self):
        return (self.bucket_name, self.bucket_type)

    def __str__(self):
        return '%s' % (self.bucket_name, self.bucket_type)
