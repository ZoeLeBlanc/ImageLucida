from django import forms
from image_lucida_app.models import *

class Base_File_Form(forms.ModelForm):

    class Meta:
        model = basefile_model.Base_File
        fields = ('base_file', 'base_file_name')
