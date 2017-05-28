from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, uploadfile_model, archivalsource_model, issue_model
from image_lucida_app.helpers import UniqueFileName

class Transform_File(models.Model):
    ''' The Transform File class is a model that defines which data is available in the Transform File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.ForeignKey(uploadfile_model.Upload_File, null=True, on_delete=models.CASCADE, blank=True)
    transform_file_name = models.CharField(max_length=200, blank=True)
    transform_file = models.ImageField(upload_to=UniqueFileName('transform-files/'))
    date_created = models.DateTimeField(auto_now_add=True)
    transform_file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    page_number = models.IntegerField(null=True, default=0)
    issue = models.ForeignKey(issue_model.Issue, null=True, on_delete=models.CASCADE, blank=True)
    archival_source = models.ForeignKey(archivalsource_model.Archival_Source, null=True, on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return '%s' % (self.transform_file_name)

    @property
    def file_url(self):
        if self.transform_file and hasattr(self.transform_file, 'url'):
            return self.transform_file.url