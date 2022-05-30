from django.db import models
from . import file_model, tag_model, basefile_model

class ImageFile(models.Model):
    ''' The Image File class is a model that defines which data is available in
    the Image File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    file_item = models.ForeignKey(file_model.File, null=True, on_delete=models.CASCADE, blank=True)
    base_file = models.ForeignKey(basefile_model.BaseFile, null=True, on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    image_file_name = models.CharField(blank=True, null=True, max_length=2000)
    tags = models.ManyToManyField('Tag', through='Image_File_Tag')
    date_updated = models.DateTimeField(auto_now=True, null=True)
    image_order = models.IntegerField(null=True, default=0)
    contains_image = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.id)

class Image_File_Tag(models.Model):
    ''' The Image File Tag class is a model that defines which data is available in
    the Image Tag File table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='image_file_tag', on_delete=models.CASCADE)
    image_file = models.ForeignKey(ImageFile, null=True, related_name='image_file_tag', on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.id)
