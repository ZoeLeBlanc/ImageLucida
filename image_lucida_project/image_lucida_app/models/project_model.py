from django.db import models
from django.contrib.auth.models import User
from . import transformfile_model, status_model, tag_model, uploadfile_model

class Project(models.Model):
    ''' The Project class is a model that defines which data is available in the Project table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=200, blank=True)
    description = models.CharField(max_length=500, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    transformed_files = models.ManyToManyField('Transform_File', through='Project_Transform_File')
    untransformed_files = models.ManyToManyField('Upload_File', through='Project_Upload_File')
    tags = models.ManyToManyField('Tag', through='Project_Tag')
    status = models.ForeignKey(status_model.Status, null=True, on_delete=models.CASCADE, blank=True)
    private = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.title)

class Project_Transform_File(models.Model):
    ''' 
    The Project File class is a model that defines a join table for Project & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    transform_file = models.ForeignKey(transformfile_model.Transform_File, null=True, related_name='project_transform_files')
    project = models.ForeignKey(Project, null=True, related_name='project_transform_files')

    def __str__(self):
        return '%s' % (self.id)

class Project_Upload_File(models.Model):
    ''' 
    The Project File class is a model that defines a join table for Project & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.ForeignKey(uploadfile_model.Upload_File, null=True, related_name='project_upload_files')
    project = models.ForeignKey(Project, null=True, related_name='project_upload_files')

    def __str__(self):
        return '%s' % (self.id)

class Project_Tag(models.Model):
    ''' 
    The Project Tag class is a model that defines a join table for Project & Tag.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='project_tag')
    project = models.ForeignKey(Project, null=True, related_name='project_tag')

    def __str__(self):
        return '%s' % (self.id)