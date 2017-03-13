from django.db import models
from django.contrib.auth.models import User
from . import transformfile_model

class Project(models.Model):
    ''' The Project class is a model that defines which data is available in the Project table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=1)
    name = models.CharField(max_length=200, blank=True)
    description = models.CharField(max_length=500, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    files = models.ManyToManyField('Transform_File', through='Project_Transform_File')

    def __str__(self):
        return '%s' % (self.name)

class Project_Transform_File(models.Model):
    ''' 
    The Project File class is a model that defines a join table for Project & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    transform_file = models.ForeignKey(transformfile_model.Transform_File, null=True, related_name='project_files')
    project = models.ForeignKey(Project, null=True, related_name='project_files')

    def __str__(self):
        return '%s' % (self.id)