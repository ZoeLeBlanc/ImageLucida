from django.db import models

class Coordinates(models.Model):
    ''' The Coordinates class is a model that defines which data is available in the Coordinates table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    top_left = models.CharField(max_length=500, blank=True, null=True)
    top_right = models.CharField(max_length=500, blank=True, null=True)
    bottom_left = models.CharField(max_length=500, blank=True, null=True)
    bottom_right = models.CharField(max_length=500, blank=True, null=True)
    multi_coords = models.CharField(blank=True, null=True, max_length=6000)

    def natural_key(self):
        return (self.top_left, self.top_right, self.bottom_left, self.bottom_right, self.multi_coords)

    def __str__(self):
        return '%s' % (self.id)
