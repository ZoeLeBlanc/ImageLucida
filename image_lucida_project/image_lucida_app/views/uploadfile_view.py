from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def upload_file(request):
    if request.method == 'POST':
        form = Upload_File_Form(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
        else:
            form = Upload_File_Form()
        return render(request, 'image_lucida_app/upload-file.html', {'form':form})