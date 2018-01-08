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
    folder_serialize = serializers.serialize("json", [folder,])
    folder_json = json.dumps({'folder': folder_serialize})
    print(folder_json)
    return HttpResponse(folder_json, content_type="application/json")

def get_folders(request, project_id):
    try:
        folders = get_list_or_404(folder_model.Folder, project_id=project_id)
        folders_json = serializers.serialize("json", folders)
        return HttpResponse(folders_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No folders."
        })
        return HttpResponse(response, content_type="application/json")

def cu_folder(request):
    data = json.loads(request.body.decode())
    project = project_model.Project.objects.get_or_create(pk=data['project_id'])
    folder = folder_model.Folder.objects.update_or_create(
        project = project[0],
        title = data['title'].replace(" ", "_"),
        description = data['description']
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
