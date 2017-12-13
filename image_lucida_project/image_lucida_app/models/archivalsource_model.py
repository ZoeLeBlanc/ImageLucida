from django.db import models
from django.contrib.auth.models import User


class Archival_Source(models.Model):
    ''' The Archival Source class is a model that defines which data is available in the Archival Source table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    archive_name = models.TextField(blank=True)
    collection_name = models.TextField(blank=True)
    folder_name = models.TextField(blank=True)

    def natural_key(self):
        return (self.archive_name, self.collection_name, self.folder_name)
    
    def __str__(self):
        return '%s %s %s' % (self.archive_name, self.collection_name, self.folder_name)
