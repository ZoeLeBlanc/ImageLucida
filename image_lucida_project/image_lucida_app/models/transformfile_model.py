from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, uploadfile_model, archivalsource_model, issue_model

class Transform_File(models.Model):
    ''' The Transform File class is a model that defines which data is available in the Transform File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.OneToOneField(uploadfile_model.Upload_File, null=True, on_delete=models.CASCADE, blank=True)
    transform_file_name = models.CharField(max_length=200, blank=True)
    transform_file = models.FileField(upload_to='transform-files/')
    date_created = models.DateTimeField(auto_now_add=True)
    transform_file_coordinates = models.OneToOneField(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    page_number = models.IntegerField(null=True)
    issue = models.ForeignKey(issue_model.Issue, null=True, on_delete=models.CASCADE, blank=True)
    archival_source = models.ForeignKey(archivalsource_model.Archival_Source, null=True, on_delete=models.CASCADE, blank=True)


    def __str__(self):
        return '%s' % (self.transform_file_name)