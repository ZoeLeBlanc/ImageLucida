from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files import File
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view, textfile_view
from django.core import serializers
import json
import os
from PIL import Image
from skimage import io
import numpy as np

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
            file_item = basefile_model.BaseFile.objects.get(base_file_name=file_name)
            file_item.base_file_coordinates=coor_obj
            file_item.height = file_height
            file_item.width = file_width
            file_item.save()
            response = json.dumps({'form':request.POST.get('base_file_name', False)})
        else:
            form = Base_File_Form()
            response = json.dumps({'form':'not saved'})
        return HttpResponse(response, content_type='application/json')


def upload_process_file(request):
    """Method to upload file to AWS"""
    file_name = request.POST.get('base_file_name', False)
    file_height = request.POST.get('base_file_height', False)
    file_width = request.POST.get('base_file_width', False)
    project_id = request.POST.get('project_id', False)
    folder_id = request.POST.get('folder_id', False)
    source_id = request.POST.get('source_id', False)
    bucket_id = request.POST.get('bucket_id', False)
    contains_image = request.POST.get('contains_image', False)
    translate_text = request.POST.get('translate_text', False)
    ocr_text = request.POST.get('ocr_text', False)
    print('process',file_name)
    project = project_model.Project.objects.get(pk=project_id)
    folder = folder_model.Folder.objects.get(pk=folder_id)
    source = source_model.Source.objects.get(pk=source_id)
    bucket = bucket_model.Bucket.objects.get(pk=bucket_id)
    if request.method == 'POST':
        form = Base_File_Form(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            coor_obj = coordinates_view.calculate_coordinates(
                int(file_width), int(file_height))
            upload_file = basefile_model.BaseFile.objects.get(
                base_file_name=file_name)
            upload_file.base_file_coordinates = coor_obj
            upload_file.height = file_height
            upload_file.width = file_width
            upload_file.transformed = True
            upload_file.save()
            page_number = ''
            if file_name.split('.')[0][-2].isspace():
                page_number = '0' + file_name.split('.')[0][-1]
            elif file_name.split('.')[0][-3].isspace():
                page_number = file_name.split('.')[0][-2:]
            else:
                page_number = file_name.split('.')[0][-3:]
            new_file_name = 'image_lucida_app/media/'+project.title.replace(" ", "_")+'_'+folder.title.replace(" ", "_")+'_'+bucket.bucket_name.replace(
                " ", "_")+'_' + source.source_name.replace(" ", "_")+ '__' + page_number + '.jpg'
            base_file_name = 'image_lucida_app/media/'+bucket.bucket_name.replace(" ", "_")+'_' + source.source_name.replace(
            " ", "_")+'__' + page_number + '.jpg'
            print(base_file_name)
            image = io.imread(upload_file.file_url)
            array_image = Image.fromarray(np.uint8(image))
            bounded_image = array_image.getbbox()
            new_image_file = array_image.crop(bounded_image)
            new_image_file = new_image_file.save(base_file_name)
            new_file = File(open(base_file_name, 'rb'))
            base_file = basefile_model.BaseFile.objects.create(
                upload_file=upload_file,
                base_file_name=base_file_name,
                height=file_height,
                width=file_width,
                base_file_coordinates=coor_obj,
                assigned=True
            )
            base_file.base_file.save(base_file_name, new_file, save=True)
            file_item = file_model.File.objects.create(
                base_file=base_file,
                file_name=new_file_name,
                page_number=page_number,
                source=source,
            )
            print(type(contains_image), ocr_text, translate_text)
            if contains_image == 'true':
                file_item.contains_image = True
            file_item.save()
            if ocr_text == 'true':
                text_file = textfile_model.TextFile.objects.get_or_create(
                    base_file=base_file,
                )
                text_file = text_file[0]
                segment_type = 'full_page'
                text = textfile_view.segment_text(
                text_file.pk, 'googlevision', base_file.pk, segment_type)
            if translate_text == 'true':
                textfile_view.translate_all_texts(text_file.pk, 'ar')
            response = json.dumps(
                {'form': request.POST.get('base_file_name', False)})
        else:
            form = Base_File_Form()
            response = json.dumps({'form': 'not saved'})
        return HttpResponse(response, content_type='application/json')

def get_upload_files(request):
    """Get all uploaded files"""
    upload_files = basefile_model.BaseFile.objects.filter(user=request.user.pk,transformed=False, assigned=False)
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
            upload_file = get_object_or_404(basefile_model.BaseFile, pk=upload_file_id)
            upload_file.base_file.delete(save=False)
            upload_file.delete()
            response = {'success':True}
        except:
            response ={'success':False}
        print(response)
        return HttpResponse(response, content_type="application/json")

def duplicate_upload_file(request):
    """Method to duplicate an uploaded file"""
    if request.method=='POST':
        data = json.loads(request.body.decode())
        upload_file_id = data['upload_file_id']
        upload_file = get_object_or_404(basefile_model.BaseFile, pk=upload_file_id)
        upload_file.pk = None
        upload_file.save()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")
