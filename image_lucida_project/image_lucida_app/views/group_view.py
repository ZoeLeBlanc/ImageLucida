from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_groups(request, source_id):
    try:
        groups_list = get_list_or_404(group_model.Group, source_id=source_id)
        print(groups_list)
        groups = serializers.serialize("json", groups_list)
        print(groups)
        return HttpResponse(groups, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No groups."
        })
        return HttpResponse(response, content_type="application/json")

def get_single_group(request, group_id):
    """Needs to retrieve single group"""
    print(group_id)
    group = get_object_or_404(group_model.Group, pk=group_id)
    group_serialize = serializers.serialize("json", [group,], indent=2, use_natural_foreign_keys=True, use_natural_primary_keys=True)
    group_json = json.dumps({'group': group_serialize})
    print(group_json)
    return HttpResponse(group_json, content_type="application/json")

def create_group(request):
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    source = source_model.Source.objects.filter(pk=data['source_id'])
    group = group_model.Group.objects.create(
        source = source[0],
        group_name = data['group_name'],
        date_published = data['date_published']
        )
    response = serializers.serialize("json", [group, ])
    return HttpResponse(response, content_type='application/json')

def update_group(request):
    data = json.loads(request.body.decode())
    source = source_model.Source.objects.filter(pk=data['source_id'])
    group = group = group_model.Group.objects.filter(pk=data['group_id']).update(
        source=source[0],
        group_name = data['group_name'],
        date_published = data['date_published'],
        )
    response = serializers.serialize("json", [group, ])
    return HttpResponse(response, content_type='application/json')

def delete_group(request):
    """Method to delete a folder"""
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        group_id = data['group_id']
        group = get_object_or_404(group_model.Group, pk=group_id)
        print(group)
        group.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")
