from django.db import models
from django.contrib.auth.models import User
from . import transformfile_model, status_model, tag_model, uploadfile_model, textannotation_model, imageannotation_model

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
    text_annotations = models.ManyToManyField('Text_Annotation', through='Project_Text_Annotation')
    image_annotations = models.ManyToManyField('Image_Annotation', through='Project_Image_Annotation')
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

class Project_Text_Annotation(models.Model):
    ''' 
    The Project File class is a model that defines a join table for Project & Text_Annotation.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    text_annotation = models.ForeignKey(textannotation_model.Text_Annotation, null=True, related_name='project_text_annotations')
    Project = models.ForeignKey(Project, null=True, related_name='project_text_annotations')

    def __str__(self):
        return '%s' % (self.id)

class Project_Image_Annotation(models.Model):
    ''' 
    The Project File class is a model that defines a join table for Project & Transform_File.

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    image_annotation = models.ForeignKey(imageannotation_model.Image_Annotation, null=True, related_name='project_image_annotations')
    Project = models.ForeignKey(Project, null=True, related_name='project_image_annotations')

    def __str__(self):
        return '%s' % (self.id)