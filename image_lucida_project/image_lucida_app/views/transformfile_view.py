from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core.urlresolvers import reverse
from django.core import serializers
from django.core.files import File
import json
import cv2
import numpy as np
from skimage import io
import uuid

def transform_upload_file(request):
    data = json.loads(request.body.decode())
    file_name = data['upload_file_name']
    file = uploadfile_model.Upload_File.objects.get(upload_file_name=file_name)
    coords = data['four_points']
    project_id = data['project_id']
    project = project_model.Project.objects.get(pk=project_id)
    data = file.file_url
    new_file = coordinates_view.four_point_transform(data, coords)
    rows, cols, ch = new_file.shape
    coords_obj = coordinates_view.calculate_coordinates(int(rows), int(cols))
    rando_numb = uuid.uuid4()
    new_file_name = 'image_lucida_app/media/transformed_' + file_name.split('.')[0] + str(rando_numb)+ '.jpg'
    file.transformed=True
    file.save()
    new_file = io.imsave(new_file_name,new_file),
    open_file = open(new_file_name, 'rb')
    new_transform_file = File(open_file)
    transform_file = transformfile_model.Transform_File.objects.create(
        upload_file=file,
        transform_file_name=new_file_name,
        )
    transform_file.transform_file.save(new_file_name, new_transform_file, save=True)
    transform_file.transform_file_coordinates=coords_obj
    transform_file.save()
    print(transform_file)
    project_model.Project_Transform_File.objects.create(
        transform_file=transform_file,
        project=project
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def add_archival_source(request):
    data = json.loads(request.body.decode())
    transform_file_name = data['transform_file_name']
    print(transform_file_name)
    archival_source_id = data['archival_source_id']
    print(archival_source_id)
    transform_file = transformfile_model.Transform_File.objects.get(transform_file_name=transform_file_name)
    archive = archivalsource_model.Archival_Source.objects.get(pk=archival_source_id)
    transform_file.archival_source = archive
    transform_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def add_issue(request):
    data = json.loads(request.body.decode())
    transform_file_id = data['transform_file_id']
    issue_id = data['issue_id']
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
    issue = issue_model.Issue.objects.get(pk=archival_source_id)
    transform_file.issue = issue
    transform_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def get_single_transform_file(request, transform_file_id):
    transform_file = get_object_or_404(transformfile_model.Transform_File, pk=transform_file_id)
    transform_file_url = transform_file.file_url
    transform_file_serialize = serializers.serialize("json", [transform_file,])
    transform_file_json = json.dumps({
        'transform_file_serialize':transform_file_serialize,
        'transform_file_url':transform_file_url
        })
    return HttpResponse(transform_file_json, content_type="application/json")