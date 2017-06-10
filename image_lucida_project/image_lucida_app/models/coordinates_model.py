from django.db import models

class Coordinates(models.Model):
    ''' The Coordinates class is a model that defines which data is available in the Coordinates table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    top_left= models.CharField(max_length=500, blank=True)
    top_right= models.CharField(max_length=500, blank=True)
    bottom_left= models.CharField(max_length=500, blank=True)
    bottom_right= models.CharField(max_length=500, blank=True)
    multi_coords= models.CharField(max_length=500, blank=True)


    def __str__(self):
        return '%s' % (self.id)

