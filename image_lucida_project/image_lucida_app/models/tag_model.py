from django.db import models

class Tag(models.Model):
    ''' The Tag class is a model that defines which data is available in the Tag table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    tag_name = models.CharField(max_length=500, blank=True, unique=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def natural_key(self):
        return self.tag_name

    def __str__(self):
        return '%s' % (self.tag_name)
