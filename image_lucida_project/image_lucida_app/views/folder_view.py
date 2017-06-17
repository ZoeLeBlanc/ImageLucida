from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json


def get_single_folder(request, folder_id):
    """Needs to retrieve all folders, untransformed files, transformed files, text annotations and image annotations"""
    print(folder_id)
    folder = get_object_or_404(folder_model.Folder, pk=folder_id)
    # Transformed files
    transformed_files = folder.transformed_files.all().order_by('id')
    transformed_list = {}
    for index,file in enumerate(transformed_files):
        file_list = {}
        tags = file.tags.all()
        if tags.exists():
            tags_serialized = serializers.serialize("json", tags)
            print(tags_serialized)
            file_list['file_name'] =file.transform_file_name
            file_list['file_url'] = file.file_url 
            file_list['file_tags'] = tags_serialized
            transformed_list[index] = file_list
        else:
            file_list['file_name'] =file.transform_file_name
            file_list['file_url'] = file.file_url 
            file_list['file_tags'] = []
            transformed_list[index] = file_list 
    print(transformed_list)
    #Tag
    tags = folder.tags.all().order_by('id')

    #Serialize EVERYTHING!!!
    folder_serialize = serializers.serialize("json", [folder,])
    transformed_files_serialize = serializers.serialize("json", transformed_files)
    tags_serialize = serializers.serialize("json", tags)
    folder_json = json.dumps({'folder': folder_serialize, "transformed_files": transformed_files_serialize, "transformed_list":transformed_list, "tags":tags_serialize})
    print(folder_json)
    return HttpResponse(folder_json, content_type="application/json")
    

def create_folder(request): 
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    project = project_model.Project.objects.get_or_create(pk=data['project_id'])
    folder = folder_model.Folder.objects.get_or_create(
        project = project[0],
        title = data['title'],
        description = data['description']
        )
    for item in data['tags']:
        print(item)
        tag = tag_model.Tag.objects.get_or_create(
            tag_name=item['tag'],
            )
        folder_model.Folder_Tag.objects.get_or_create(
            folder=folder[0],
            tag=tag[0]
            )
    response = serializers.serialize("json", [folder[0], ])
    return HttpResponse(response, content_type='application/json')

def update_folder(request): 
    """Method to update a folder"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    project = project_model.Project.objects.get_or_create(project_pk=data['project_id'])
    folder = folder_model.Folder.objects.update_or_create(
        project = project[0],
        title = data['title'],
        description = data['description']
        )
    for item in data['tags']:
        print(item)
        tag = tag_model.Tag.objects.get_or_create(
            tag_name=item['tag'],
            )
        folder_model.Folder_Tag.objects.update_or_create(
            folder=folder[0],
            tag=tag[0]
            )
    response = serializers.serialize("json", [folder[0], ])
    return HttpResponse(response, content_type='application/json')

 
def delete_folder(request): 
    """Method to delete a folder"""
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        folder_id = data['folder_id']
        folder = get_object_or_404(folder_model.Folder, pk=folder_id)
        print(folder)
        folder.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")

def duplicate_folder(request, folder_id):
    """Method to duplicate folder"""
    folder = get_object_or_404(folder_model.Folder, pk=folder_id)
    folder.pk = None
    folder.save()
    response = {'success':True}
    return HttpResponse(response, content_type="application/json")

def tag_folder(request):
    data = json.loads(request.body.decode())
    folder_id = data['folder_id']
    tag_name = data['tag_name']
    tag = get_object_or_404(tag_model.Tag, tag_name=tag_name)
    folder = get_object_or_404(folder_model.Folder, pk=folder_id)
    tag_folder = folder_model.Folder_Tag.objects.get_or_create(
        tag =tag,
        folder = folder
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')