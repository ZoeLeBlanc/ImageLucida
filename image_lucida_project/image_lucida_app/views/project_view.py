from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_projects(request):
    try:
        projects = get_list_or_404(project_model.Project, user=request.user.pk)
        print(projects)
        projects_json = serializers.serialize("json", projects)
        print(projects_json)
        return HttpResponse(projects_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No projects."
        })
        return HttpResponse(response, content_type="application/json")

def get_single_project(request, project_id):
    """Needs to retrieve all folders, untransformed files, transformed files, text annotations and image annotations"""
    print(project_id)
    project = get_object_or_404(project_model.Project, pk=project_id)
    folders = project.folder_set.all()
    project_serialize = serializers.serialize("json", [project,])
    folders_serialize = serializers.serialize("json", folders)
    project_json = json.dumps({'project': project_serialize, 'folders': folders_serialize})
    print(project_json)
    return HttpResponse(project_json, content_type="application/json")
    

def create_project(request): 
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    status = status_model.Status.objects.get_or_create(status=data['status'])
    print(status)
    project = project_model.Project.objects.get_or_create(
        user = user[0],
        title = data['title'], 
        description = data['description'], 
        status = status[0], 
        private = data['private'],
        )
    for item in data['tags']:
        print(item)
        tag = tag_model.Tag.objects.get_or_create(
            tag_name=item['tag'],
            )
        project_model.Project_Tag.objects.get_or_create(
            project=project[0],
            tag=tag[0]
            )
    response = serializers.serialize("json", [project[0], ])
    return HttpResponse(response, content_type='application/json')

def update_project(request): 
    """Method to update a project"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    status = status_model.Status.objects.get_or_create(status=data['status'])
    print(status)
    project = project_model.Project.objects.update_or_create(
        user = user[0],
        title = data['title'], 
        description = data['description'], 
        status = status[0], 
        private = data['private'],
        )
    for item in data['tags']:
        print(item)
        tag = tag_model.Tag.objects.get_or_create(
            tag_name=item['tag'],
            )
        project_model.Project_Tag.objects.update_or_create(
            project=project[0],
            tag=tag[0]
            )
    response = serializers.serialize("json", [project[0], ])
    return HttpResponse(response, content_type='application/json')
 
def delete_project(request, project_id): 
    """Method view to logout user"""
    pass

def duplicate_project(request, project_id):
    """Method to duplicate project"""
    project = get_object_or_404(project_model.Project, pk=project_id)
    folders = project.folder_set.all()
    project.pk = None
    project.save()
    response = {'success':True}
    return HttpResponse(response, content_type="application/json")