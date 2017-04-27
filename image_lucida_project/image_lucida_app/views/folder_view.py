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
    # Untransformed files
    untransformed_files = folder.untransformed_files.all().order_by('id')
    untransformed_list = []
    for file in untransformed_files:
        file_list = []
        file_list.extend({file.upload_file_name, file.file_url})     
        untransformed_list.append(file_list)
    # Transformed files
    transformed_files = folder.transformed_files.all().order_by('id')
    transformed_list = []
    for file in transformed_files:
        file_list = []
        file_list.extend({file.transform_file_name, file.file_url})         
        transformed_list.append(file_list)
    # Text annotations
    text_annotations = folder.text_annotations.all().order_by('id')
    # Image annotations
    image_annotations = folder.image_annotations.all().order_by('id')
    #Tag
    tags = folder.tags.all().order_by('id')

    #Serialize EVERYTHING!!!
    folder_serialize = serializers.serialize("json", [folder,])
    untransformed_files_serialize = serializers.serialize("json", untransformed_files)
    transformed_files_serialize = serializers.serialize("json", transformed_files)
    text_annotations_serialize = serializers.serialize("json", text_annotations)
    image_annotations_serialize = serializers.serialize("json", image_annotations)
    tags_serialize = serializers.serialize("json", tags)
    folder_json = json.dumps({'folder': folder_serialize, 'untransformed_list': untransformed_list, 'untransformed_files':untransformed_files_serialize, "transformed_files": transformed_files_serialize, "transformed_list":transformed_list, "text_annotations":text_annotations_serialize, "image_annotations":image_annotations_serialize, "tags":tags_serialize})
    print(folder_json)
    return HttpResponse(folder_json, content_type="application/json")
    

def create_folder(request): 
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    project = project_model.Project.objects.get_or_create(project_pk=data['project_id'])
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
    """Method view to login user"""
    pass

 
def delete_folder(request): 
    """Method view to logout user"""
    pass
