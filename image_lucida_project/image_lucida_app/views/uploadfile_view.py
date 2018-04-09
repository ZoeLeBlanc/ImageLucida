from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core import serializers
import json
import os

def upload_file(request):
    """Method to upload file to AWS"""
    file_name = request.POST.get('base_file_name', False)
    file_height = request.POST.get('base_file_height', False)
    file_width = request.POST.get('base_file_width', False)
    if request.method == 'POST':
        form = Base_File_Form(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            coor_obj = coordinates_view.calculate_coordinates(int(file_width), int(file_height))
            file_item = basefile_model.Base_File.objects.get(base_file_name=file_name)
            file_item.base_file_coordinates=coor_obj
            file_item.height = file_height
            file_item.width = file_width
            file_item.save()
            response = json.dumps({'form':request.POST.get('base_file_name', False)})
        else:
            form = Base_File_Form()
            response = json.dumps({'form':'not saved'})
        return HttpResponse(response, content_type='application/json')

def get_upload_files(request):
    """Get all uploaded files"""
    upload_files = basefile_model.Base_File.objects.filter(user=request.user.pk,transformed=False, assigned=False)
    if len(upload_files) >0:
        upload_list = []
        for file_item in upload_files:
            file_list = []
            file_list.extend({file_item.base_file_name, file_item.file_url})
            upload_list.append(file_list)
        files_json = serializers.serialize("json", upload_files)
        response = json.dumps({'upload_files':files_json, 'upload_list':upload_list})
        return HttpResponse(response, content_type='application/json')
    else:
        response = json.dumps({
            "error": "No uploaded files."
        })
        return HttpResponse(response, content_type="application/json")

def delete_uploaded_file(request):
    """Method to delete an uploaded file"""
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        upload_file_id = data['upload_file_id']
        try:
            upload_file = get_object_or_404(basefile_model.Base_File, pk=upload_file_id)
            upload_file.base_file.delete(save=False)
            upload_file.delete()
            response = {'success':True}
        except:
            response ={'success':False}
        return HttpResponse(response, content_type="application/json")

def duplicate_upload_file(request):
    """Method to duplicate an uploaded file"""
    if request.method=='POST':
        data = json.loads(request.body.decode())
        upload_file_id = data['upload_file_id']
        upload_file = get_object_or_404(basefile_model.Base_File, pk=upload_file_id)
        upload_file.pk = None
        upload_file.save()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")
