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
    file_id = data['upload_file_id']
    file_name = data['upload_file_name']
    file = uploadfile_model.Upload_File.objects.get(pk=file_id)
    coords = data['four_points']
    height = data['height']
    width = data['width']
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
    transform_file.height = height
    transform_file.width = width
    transform_file.save()
    print(transform_file)
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def assign_transform_file(request):
    data = json.loads(request.body.decode())
    project_id = data['project_id']
    folder_id = data['folder_id']
    transform_file_id = data['transform_file_id']
    cover = data['cover']
    page_number = data['page_number']
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
    if len(project_id) > 0:
        project = project_model.Project.objects.get(pk=project_id)
        project_model.Project_Transform_File.objects.create(
        transform_file=transform_file,
        project=project
        )
    if len(folder_id) > 0:
        folder = folder_model.Folder.objects.get(pk=folder_id)
        folder_model.Folder_Transform_File.objects.create(
        transform_file=transform_file,
        folder=folder
        )
    transform_file.assigned = True
    transform_file.cover = cover
    transform_file.page_number = page_number
    transform_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def add_archival_source(request):
    data = json.loads(request.body.decode())
    transform_file_id = data['transform_file_id']
    print(transform_file_id)
    archival_source_id = data['archival_source_id']
    print(archival_source_id)
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
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
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
    archival_source = transform_file.archival_source
    if archival_source is None:
        archival_source = archivalsource_model.Archival_Source.objects.get_or_create(pk=1)
        print(archival_source)
        archival_source_serialize = serializers.serialize("json", [archival_source[0],])
        archival_source_default = True
    else:
        archival_source_serialize = serializers.serialize("json", [archival_source,])
        archival_source_default = False

    issue = transform_file.issue
    if issue is None:
        issue = issue_model.Issue.objects.get_or_create(pk=1)
        issue_serialize = serializers.serialize("json", [issue[0],])
        issue_default = True
    else:
        issue_serialize = serializers.serialize("json", [issue,])
        issue_default = False
    texts = transform_file.text_annotation_set.all()
    images = transform_file.image_annotation_set.all()
    tags = transform_file.tags.all()
    tags_serialize = serializers.serialize("json", list(tags))
    print(tags)
    # if tags.exists():
    #     tags_serialize = serializers.serialize("json", list(tags))
    #     tags_default = False
    # else:
    #     tags = tag_model.Tag.objects.get_or_create(pk=1)
    #     tags_serialize = serializers.serialize("json", [tags[0],])
    #     tags_default = True

    transform_file_url = transform_file.file_url
    texts_serialize = serializers.serialize("json", list(texts))
    images_serialize = serializers.serialize("json", list(images))

    transform_file_serialize = serializers.serialize("json", [transform_file,])

    transform_file_json = json.dumps({
        'transform_file':transform_file_serialize,
        'archival_source':archival_source_serialize,
        'archival_source_default':archival_source_default,
        'issue':issue_serialize,
        'issue_default':issue_default,
        'transform_file_url':transform_file_url,
        'texts_serialize':texts_serialize,
        'images_serialize':images_serialize,
        'tags_serialize':tags_serialize
        # 'tags_default':tags_default
        })
    return HttpResponse(transform_file_json, content_type="application/json")

def delete_transform_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        transformed_file_id = data['transformed_file_id']
        transformed_file = get_object_or_404(transformfile_model.Transform_File, pk=transformed_file_id)
        print(transformed_file)
        transformed_file.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def duplicate_transform_file(request):
    """Method to delete an transformed file"""
    if request.method=='POST':
        data = json.loads(request.body.decode())
        transformed_file_id = data['transformed_file_id']
        transformed_file = get_object_or_404(transformfile_model.Transform_File, pk=transformed_file_id)
        print(transformed_file)
        transformed_file.pk = None
        transformed_file.save()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def update_transform_file(request):
    """Method to update a transformed file"""
    data = json.loads(request.body.decode())
    transformed_file_id = data['transformed_file_id']
    transformed_file = get_object_or_404(transformfile_model.Transform_File, pk=transformed_file_id)
    transform_file = transformfile_model.Transform_File.objects.update_or_create(
        transform_file_name = data['transform_file_name']
        )
    response = serializers.serialize("json", [transform_file[0], ])
    return HttpResponse(response, content_type='application/json')

def untransform_file(request):
    """Method to update a transformed file"""
    data = json.loads(request.body.decode())
    transformed_file_id = data['transformed_file_id']
    transformed_file = transformfile_model.Transform_File.objects.get(pk=transformed_file_id)
    print(transformed_file.upload_file_id)
    upload_file = uploadfile_model.Upload_File.objects.get(pk=transformed_file.upload_file_id)
    upload_file.transformed = False
    upload_file.save()
    transformed_file.delete()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def get_transform_files(request):
    try:
        transformed_files = get_list_or_404(transformfile_model.Transform_File, user=request.user.pk, assigned=False)
        print(transformed_files)
        transformed_list = []
        for file in transformed_files:
            file_list = []
            file_list.extend({file.transform_file_name, file.file_url})
            transformed_list.append(file_list)
        files_json = serializers.serialize("json", transformed_files)
        print(files_json)
        response = json.dumps({'transformed_files':files_json, 'transformed_list':transformed_list})
        return HttpResponse(response, content_type='application/json')
    except:
        response = json.dumps({
            "error": "No transformed files."
        })
        return HttpResponse(response, content_type="application/json")

def unassign_transform_file(request):
    '''Needs refactoring '''
    data = json.loads(request.body.decode())
    transform_file_id = data['transform_file_id']
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
    folder_model.Folder_Transform_File.remove(folder)
    project = transform_file.project_transform_files_set.all()
    transform_file.project_transform_files_set.remove(project)
    transform_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def tag_transform_file(request):
    data = json.loads(request.body.decode())
    transform_file_id = data['transform_file_id']
    tag_name = data['tag_name']
    tag = tag_model.Tag.objects.get_or_create( tag_name=tag_name)
    transform_file = get_object_or_404(transformfile_model.Transform_File, pk=transform_file_id)
    tag_transform_file = transformfile_model.Transform_File_Tag.objects.get_or_create(
        tag =tag[0],
        transform_file = transform_file
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def remove_tag_transform_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        transform_file_id = data['transform_file_id']
        tag_name = data['tag_name']
        tag = tag_model.Tag.objects.get_or_create( tag_name=tag_name)
        transform_file = get_object_or_404(transformfile_model.Transform_File, pk=transform_file_id)
        tag_transform_file = transformfile_model.Transform_File_Tag.objects.get(
            tag =tag[0],
            transform_file = transform_file
            )
        tag_transform_file.delete()
        response = {'success': 'true'}
        return HttpResponse(response, content_type='application/json')
