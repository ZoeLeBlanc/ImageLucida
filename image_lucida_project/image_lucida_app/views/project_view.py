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
        projects_json = serializers.serialize("json", projects, indent=2, use_natural_foreign_keys=True, use_natural_primary_keys=True)
        return HttpResponse(projects_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No projects."
        })
        return HttpResponse(response, content_type="application/json")

def get_single_project(request, project_id):
    """Needs to retrieve all folders, untransformed files, transformed files, text annotations and image annotations"""
    project = get_object_or_404(project_model.Project, pk=project_id)
    project_serialize = serializers.serialize("json", [project,], indent=2, use_natural_foreign_keys=True, use_natural_primary_keys=True)
    project_json = json.dumps({'project': project_serialize})
    return HttpResponse(project_json, content_type="application/json")

def cu_project(request):
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    project = project_model.Project.objects.update_or_create(
        user = user[0],
        title = data['title'].replace(" ", "_"),
        description = data['description'],
        )
    response = serializers.serialize("json", [project[0], ])
    return HttpResponse(response, content_type='application/json')


def delete_project(request, project_id):
    """Method view to logout user"""
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        project_id = data['project_id']
        project = get_object_or_404(project_model.Project, pk=project_id)
        print(project)
        project.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def duplicate_project(request, project_id):
    """Method to duplicate project"""
    project = get_object_or_404(project_model.Project, pk=project_id)
    folders = project.folder_set.all()
    project.pk = None
    project.save()
    response = {'success':True}
    return HttpResponse(response, content_type="application/json")
