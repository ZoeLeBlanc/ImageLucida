from django.db import models
from . import source_model


class Group(models.Model):
    ''' The Group class is a model that defines which data is available in the Group table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    group_name = models.TextField(blank=True, null=True)
    date_published = models.CharField(max_length=500, blank=True, null=True)
    source = models.ForeignKey(source_model.Source, null=True, on_delete=models.CASCADE, blank=True)

    def natural_key(self):
        return (self.group_name, self.date_published)

    def __str__(self):
        return '%s' % (self.group_name)
