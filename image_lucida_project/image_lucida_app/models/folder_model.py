from django.db import models
from django.contrib.auth.models import User
from . import project_model

class Folder(models.Model):
    ''' The Folder class is a model that defines which data is available in the Folder table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    project = models.ForeignKey(project_model.Project, on_delete=models.CASCADE, default=1, null=True)
    title = models.CharField(unique=True, null=True, max_length=2000)
    description = models.CharField(max_length=500, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    date_updated = models.DateField(auto_now=True, null=True)

    def __str__(self):
        return '%s' % (self.title)
