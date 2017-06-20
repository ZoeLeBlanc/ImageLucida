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
    file_name = request.POST.get('upload_file_name', False)
    print(file_name)
    file_height = request.POST.get('upload_file_height', False)
    file_width = request.POST.get('upload_file_width', False)
    if request.method == 'POST':
        form = Upload_File_Form(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            form.save()
            coor_obj = coordinates_view.calculate_coordinates(int(file_width), int(file_height))
            file = uploadfile_model.Upload_File.objects.get(upload_file_name=file_name)
            file.upload_file_coordinates=coor_obj
            file.height = file_height
            file.width = file_width
            file.save()
            response = json.dumps({'form':request.POST.get('upload_file_name', False)})
        else:
            form = Upload_File_Form()
            response = json.dumps({'form':'not saved'})
        return HttpResponse(response, content_type='application/json')

def get_untransformed_files(request):
    untransformed_files = get_list_or_404(uploadfile_model.Upload_File, user=request.user.pk, transformed=False)
    untransformed_list = []
    for file in untransformed_files:
        file_list = []
        file_list.extend({file.upload_file_name, file.file_url})     
        untransformed_list.append(file_list)
    files_json = serializers.serialize("json", untransformed_files)
    response = json.dumps({'untransformed_files':files_json, 'untransformed_list':untransformed_list})
    return HttpResponse(response, content_type='application/json')

def delete_uploaded_file(request):
    """Method to delete an uploaded file"""
    print("is this printing first?")
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        untransformed_file_id = data['untransformed_file_id']
        untransformed_file = get_object_or_404(uploadfile_model.Upload_File, pk=untransformed_file_id)
        print(untransformed_file)
        untransformed_file.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def duplicate_untransformed_file(request):
    """Method to delete an uploaded file"""
    if request.method=='POST': 
        data = json.loads(request.body.decode())
        untransformed_file_id = data['untransformed_file_id']
        untransformed_file = get_object_or_404(uploadfile_model.Upload_File, pk=untransformed_file_id)
        print(untransformed_file)
        untransformed_file.pk = None
        untransformed_file.save()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

