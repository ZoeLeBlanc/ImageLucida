from django.db import models
from django.contrib.auth.models import User
from . import coordinates_model, uploadfile_model, folder_model, source_model, group_model, tag_model
from image_lucida_app.helpers import UniqueFileName

class File(models.Model):
    ''' The File class is a model that defines which data is available in the File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.ForeignKey(uploadfile_model.Upload_File, null=True, on_delete=models.CASCADE, blank=True)
    file_name = models.CharField(max_length=200, blank=True)
    file_item = models.ImageField(upload_to=UniqueFileName('files/'))
    date_created = models.DateTimeField(auto_now_add=True)
    file_coordinates = models.ForeignKey(coordinates_model.Coordinates, null=True, on_delete=models.CASCADE, blank=True)
    page_number = models.IntegerField(null=True, default=0)
    cover = models.BooleanField(default=False)
    folder = models.ForeignKey(folder_model.Folder, null=True, on_delete=models.CASCADE, blank=True)
    group = models.ForeignKey(group_model.Group, null=True, on_delete=models.CASCADE, blank=True)
    source = models.ForeignKey(source_model.Source, null=True, on_delete=models.CASCADE, blank=True)
    assigned = models.BooleanField(default=False)
    tesseract_processed = models.BooleanField(default=False)
    google_vision_processed = models.BooleanField(default=False)
    auto_image_processed = models.BooleanField(default=False)
    manual_image_processed = models.BooleanField(default=False)
    height = models.IntegerField(null=True, default=0)
    width = models.IntegerField(null=True, default=0)
    tags = models.ManyToManyField('Tag', through='Transform_File_Tag')
    date_updated = models.DateTimeField(auto_now=True)
    date_published = models.CharField(blank=True)

    def __str__(self):
        return '%s' % (self.file_name)

    @property
    def file_url(self):
        if self.file and hasattr(self.file, 'url'):
            return self.file.url

class File_Tag(models.Model):
    ''' The File Tag class is a model that defines which data is available in the File Tag table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='file_tag')
    file_item = models.ForeignKey(File, null=True, related_name='file_tag')

    def __str__(self):
        return '%s' % (self.id)
