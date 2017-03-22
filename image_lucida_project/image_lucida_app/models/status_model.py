from django.db import models

class Status(models.Model):
    ''' The Tag class is a model that defines which data is available in the Tag table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    status = models.CharField(max_length=500, blank=True, unique=True)
    

    def __str__(self):
        return '%s' % (self.status)