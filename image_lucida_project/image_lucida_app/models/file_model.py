from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, basefile_model, source_model, group_model, tag_model
from image_lucida_app.helpers import UniqueFileName

class File(models.Model):
    ''' The File class is a model that defines which data is available in the File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    base_file = models.ForeignKey(basefile_model.Base_File, null=True, on_delete=models.CASCADE, blank=True)
    file_name = models.CharField(max_length=200, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    page_number = models.IntegerField(null=True, default=0)
    group = models.ForeignKey(group_model.Group, null=True, on_delete=models.CASCADE, blank=True)
    source = models.ForeignKey(source_model.Source, null=True, on_delete=models.CASCADE, blank=True)
    tags = models.ManyToManyField('Tag', through='File_Tag')
    date_updated = models.DateTimeField(auto_now=True, null=True)
    date_published = models.CharField(blank=True, null=True, max_length=500)

    def __str__(self):
        return '%s' % (self.file_name)

class File_Tag(models.Model):
    ''' The File Tag class is a model that defines which data is available in the File Tag table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='file_tag', on_delete=models.CASCADE)
    file_item = models.ForeignKey(File, null=True, related_name='file_tag', on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.id)
