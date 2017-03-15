from django.db import models

class Coordinates(models.Model):
    ''' The Coordinates class is a model that defines which data is available in the Coordinates table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    right_top= models.CharField(max_length=500, blank=True)
    left_top= models.CharField(max_length=500, blank=True)
    left_bottom= models.CharField(max_length=500, blank=True)
    right_bottom= models.CharField(max_length=500, blank=True)


    def __str__(self):
        return '%s' % (self.id)