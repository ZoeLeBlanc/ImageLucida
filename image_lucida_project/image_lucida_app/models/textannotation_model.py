from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, transformfile_model

class Text_Annotation(models.Model):
    ''' The Text Annotation class is a model that defines which data is available in the Text Annotation table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.OneToOneField(uploadfile_model.Upload_File, null=True, on_delete=models.CASCADE, blank=True)
    article_title = models.CharField(max_length=200, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    text_annotation_coordinates = models.OneToOneField(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    order = models.IntegerField(null=True)
    issue = models.ForeignKey(issue_model.Issue, null=True, on_delete=models.CASCADE, blank=True)
    archival_source = models.ForeignKey(archivalsource_model.Archival_Source, null=True, on_delete=models.CASCADE, blank=True)
    cover = models.BooleanField(default=False)
    cover_story = models.BooleanField(default=False)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.transform_file_name)