from django.db import models

class Issue(models.Model):
    ''' The Issue class is a model that defines which data is available in the Issue table so a database can be created from it.

    Method List:
        -none

    Argument List:
        -models.Model: This argument allows the class to access field types.

    Author: Zoe LeBlanc
    '''
    issue_name = models.CharField(max_length=500, blank=True)
    date_published = models.CharField(max_length=500, blank=True)
    publication_location = models.CharField(max_length=500, blank=True)
    issue_number = models.CharField(max_length=200, blank=True)
    

    def __str__(self):
        return '%s' % (self.issue_name)