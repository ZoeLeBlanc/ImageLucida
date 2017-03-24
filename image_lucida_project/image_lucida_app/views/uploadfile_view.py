from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def upload_file(request):
    project_id = request.POST.get('project_id', False)
    print(project_id)
    file_name = request.POST.get('upload_file_name', False)
    file_height = request.POST.get('upload_file_height', False)
    print(file_height)
    file_width = request.POST.get('upload_file_width', False)
    print(file_width)
    if request.method == 'POST':
        form = Upload_File_Form(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            form.save()
            coor_obj = coordinates_view.calculate_coordinates(int(file_width), int(file_height))
            file = uploadfile_model.Upload_File.objects.get(upload_file_name=file_name)
            file.upload_file_coordinates=coor_obj
            file.save()
            project = project_model.Project.objects.get(pk=project_id)
            print(project)
            project_model.Project_Upload_File.objects.create(upload_file=file, project=project)
            response = json.dumps({'form':request.POST.get('upload_file_name', False)})
        else:
            form = Upload_File_Form()
            response = json.dumps({'form':'not saved'})
        return HttpResponse(response, content_type='application/json')

def get_untransformed_files(request):
    untransformed_files = uploadfile_model.Upload_file.objects.filter(user=request.user.pk, transformed=False)
    print(untransformed_files)
    files_json = serializers.serialize("json", [untransformed_files, ])
    return HttpResponse(files_json, content_type='application/json')