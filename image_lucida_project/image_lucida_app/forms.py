from django import forms
from image_lucida_app.models import *

class Upload_File_Form(forms.ModelForm):

    class Meta:
        model = uploadfile_model.Upload_File
        fields = ('upload_file', 'upload_file_name')
