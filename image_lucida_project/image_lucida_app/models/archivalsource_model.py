from django.db import models

class Archival_Source(models.Model):
    ''' The Archival Source class is a model that defines which data is available in the Archival Source table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    archive_name = models.CharField(max_length=200, blank=True)
    collection_name = models.CharField(max_length=200, blank=True)
    folder_name = models.CharField(max_length=200, blank=True)
    

    def __str__(self):
        return '%s %s %s' % (self.archive_name, self.collection_name, self.folder_name)