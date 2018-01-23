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
from PIL import Image
import os

def create_file(request):
    data = json.loads(request.body.decode())
    coords = data['multi_coords']
    upload_file_id = data['upload_file_id']
    upload_file_name = data['upload_file_name']
    upload_file = uploadfile_model.Upload_File.objects.get(pk=upload_file_id)
    height = data['height']
    print("file height", height)
    width = data['width']
    print("file width", width)
    page_number=data['page_number']
    date_published=data['date_published']
    if len(date_published)>0:
        date_published=' '
    project = project_model.Project.objects.get(pk=data['project_id'])
    folder = folder_model.Folder.objects.get(pk=data['folder_id'])
    source = source_model.Source.objects.get(pk=data['source_id'])
    bucket = bucket_model.Bucket.objects.get(pk=data['bucket_id'])
    upload_file_url = upload_file.file_url
    image = coordinates_view.crop_shapes(upload_file_url, coords, height, width)
    array_image = Image.fromarray(np.uint8(image))
    bounded_image = array_image.getbbox()
    new_file = array_image.crop(bounded_image)
    coords_obj = coordinates_model.Coordinates.objects.create(
        multi_coords=json.dumps(coords)
    )
    if len(data['group_id']) > 0:
        group = group_model.Group.objects.get(pk=data['group_id'])
        new_file_name = 'image_lucida_app/media/'+project.title.replace(" ", "_")+folder.title.replace(" ", "_")+bucket.bucket_name.replace(" ", "_")+'_' +source.source_name.replace(" ", "_")+'_' +group.group_name.replace(" ", "_")+'_' + date_published.replace(" ", "_")+'_' + str(page_number) + '.jpg'
        file_item = file_model.File.objects.create(
            upload_file=upload_file,
            file_name=new_file_name,
            date_published=date_published,
            page_number=page_number,
            group=group,
            source=source,
            assigned=True,
            height=height,
            width=width,
            file_coordinates=coords_obj,
        )
    else:
        new_file_name = 'image_lucida_app/media/'+project.title.replace(" ", "_")+folder.title.replace(" ", "_")+bucket.bucket_name.replace(" ", "_")+'_' +source.source_name.replace(" ", "_")+'_' +date_published.replace(" ", "_")+'_' + str(page_number) + '.jpg'
        file_item = file_model.File.objects.create(
            upload_file=upload_file,
            file_name=new_file_name,
            page_number=page_number,
            source=source,
            assigned=True,
            height=height,
            width=width,
            file_coordinates=coords_obj,
            date_published=date_published,
        )
    new_file = new_file.save(new_file_name)
    open_file = open(new_file_name, 'rb')
    new_file = File(open_file)
    file_item.file_item.save(new_file_name, new_file, save=True)
    file_item.save()
    # os.remove(file_item.file_name)
    upload_file.transformed=True
    upload_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')


def get_single_file(request, file_id):
    print(file_id)
    file_item = file_model.File.objects.get(pk=file_id)
    texts = file_item.text_file_set.all()
    texts_serialize = {}
    if len(texts)>0:
        texts_serialize = serializers.serialize("json", list(texts))
    images = file_item.image_file_set.all()
    print(images)
    images_serialize = {}
    images_data = {}
    if len(images) > 0:
        for index,image in enumerate(images):
            images_list = {}
            tags = image.tags.all()
            if tags.exists():
                tags_serialized = serializers.serialize("json", tags)
                images_list['image_name'] = image.image_file_name
                images_list['image_url'] = image.file_url
                images_list['image_tags'] = tags_serialized
                images_data[index] = images_list
            else:
                images_list['image_name'] = image.image_file_name
                images_list['image_url'] = image.file_url
                images_list['image_tags'] =[]
                images_data[index] = images_list
        images_serialize = serializers.serialize("json", list(images))
        print(images_serialize)
    tags = file_item.tags.all()
    tags_serialize = {}
    if len(tags)>0:
        tags_serialize = serializers.serialize("json", list(tags))

    file_url = file_item.file_url
    file_serialize = serializers.serialize("json", [file_item,])
    print(file_serialize)
    file_json = json.dumps({
        'file':file_serialize,
        'file_url':file_url,
        'texts_serialize':texts_serialize,
        'images_serialize':images_serialize, 'images_data': images_data,
        'tags_serialize':tags_serialize
        })
    return HttpResponse(file_json, content_type="application/json")

def get_source_files(request, source_id):
    print("source_id", source_id)
    files = file_model.File.objects.filter(source_id=source_id)
    print("files",serializers.serialize("json",files))
    if len(files) > 0:
        files_list = []
        for file_item in files:
            file_list = []
            file_list.extend({file_item.file_name, file_item.file_url})
            files_list.append(file_list)
        files = serializers.serialize("json", files)
        response = json.dumps({'files':files, 'files_list':files_list})

        return HttpResponse(response, content_type="application/json")
    else:
        response = json.dumps({
            "error": "No files."
        })
        return HttpResponse(response, content_type="application/json")

def get_group_files(request, group_id):
    files = file_model.File.objects.filter(group_id=group_id)
    print("files",serializers.serialize("json",files))
    if len(files) > 0:
        files_list = []
        for file_item in files:
            file_list = []
            file_list.extend({file_item.file_name, file_item.file_url})
            files_list.append(file_list)
        files = serializers.serialize("json", files)
        response = json.dumps({'files':files, 'files_list':files_list})

        return HttpResponse(response, content_type="application/json")
    else:
        response = json.dumps({
            "error": "No files."
        })
        return HttpResponse(response, content_type="application/json")


def delete_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        file_id = data['file_id']
        file_item = get_object_or_404(file_model.File, pk=file_id)
        print(file_item)
        file_item.file_item.delete(save=False)
        file_item.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def update_file(request):
    """Method to update a transformed file"""
    data = json.loads(request.body.decode())
    file_id = data['file_id']
    file_item = file_model.File.objects.filter(pk=data['file_id']).update(page_number=data['page_number'],date_published=['date_published'])
    file_item.save()
    file_item_serialize = serializers.serialize("json", [file_item[0],])
    return HttpResponse(file_item_serialized, content_type='application/json')

def untransform_file(request):
    """Method to update a transformed file"""
    data = json.loads(request.body.decode())
    file_item = file_model.File.objects.get(pk=data['file_id'])
    print(file_item.upload_file_id)
    upload_file = uploadfile_model.Upload_File.objects.get(pk=file_item.upload_file_id)
    upload_file.transformed = False
    upload_file.save()
    transformed_file.delete()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def tag_file(request):
    data = json.loads(request.body.decode())
    tag = tag_model.Tag.objects.get_or_create( tag_name=data['tag_name'])
    file_item = get_object_or_404(file_model.File, pk=data['file_id'])
    tag_file = file_model.File_Tag.objects.get_or_create(
        tag =tag[0],
        file_item = file_item
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def remove_tag_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        tag = tag_model.Tag.objects.get_or_create( tag_name=data['tag_name'])
        file_item = get_object_or_404(file_model.File, pk=data['file_id'])
        tag_file = file_model.File_Tag.objects.get(
            tag =tag[0],
            file_item = file_item
            )
        tag_file.delete()
        response = {'success': 'true'}
        return HttpResponse(response, content_type='application/json')
