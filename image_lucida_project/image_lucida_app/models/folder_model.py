from django.db import models
from django.contrib.auth.models import User
from . import transformfile_model, tag_model, uploadfile_model, imageannotation_model, textannotation_model, project_model

class Folder(models.Model):
    ''' The Folder class is a model that defines which data is available in the Folder table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    project = models.ForeignKey(project_model.Project, on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=200, blank=True)
    description = models.CharField(max_length=500, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    transformed_files = models.ManyToManyField('Transform_File', through='Folder_Transform_File')
    untransformed_files = models.ManyToManyField('Upload_File', through='Folder_Upload_File')
    text_annotations = models.ManyToManyField('Text_Annotation', through='Folder_Text_Annotation')
    image_annotations = models.ManyToManyField('Image_Annotation', through='Folder_Image_Annotation')
    tags = models.ManyToManyField('Tag', through='Folder_Tag')


    def __str__(self):
        return '%s' % (self.title)

class Folder_Transform_File(models.Model):
    ''' 
    The Folder File class is a model that defines a join table for Folder & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    transform_file = models.ForeignKey(transformfile_model.Transform_File, null=True, related_name='folder_transform_files')
    folder = models.ForeignKey(Folder, null=True, related_name='folder_transform_files')

    def __str__(self):
        return '%s' % (self.id)

class Folder_Upload_File(models.Model):
    ''' 
    The Folder File class is a model that defines a join table for Folder & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    upload_file = models.ForeignKey(uploadfile_model.Upload_File, null=True, related_name='folder_upload_files')
    folder = models.ForeignKey(Folder, null=True, related_name='folder_upload_files')

    def __str__(self):
        return '%s' % (self.id)

class Folder_Text_Annotation(models.Model):
    ''' 
    The Folder File class is a model that defines a join table for Folder & Text_Annotation.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    text_annotation = models.ForeignKey(textannotation_model.Text_Annotation, null=True, related_name='folder_text_annotations')
    folder = models.ForeignKey(Folder, null=True, related_name='folder_text_annotations')

    def __str__(self):
        return '%s' % (self.id)

class Folder_Image_Annotation(models.Model):
    ''' 
    The Folder File class is a model that defines a join table for Folder & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    image_annotation = models.ForeignKey(imageannotation_model.Image_Annotation, null=True, related_name='folder_image_annotations')
    folder = models.ForeignKey(Folder, null=True, related_name='folder_image_annotations')

    def __str__(self):
        return '%s' % (self.id)

class Folder_Tag(models.Model):
    ''' 
    The Folder Tag class is a model that defines a join table for Folder & Tag.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag = models.ForeignKey(tag_model.Tag, null=True, related_name='folder_tag')
    folder = models.ForeignKey(Folder, null=True, related_name='folder_tag')

    def __str__(self):
        return '%s' % (self.id)