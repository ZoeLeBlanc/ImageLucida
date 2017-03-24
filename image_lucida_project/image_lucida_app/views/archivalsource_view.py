from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_archival_sources(request):
    try:
        archival_sources = get_list_or_404(archivalsource_model.Archival_Source, user=request.user.pk)
        print(archival_sources)
        archival_sources_json = serializers.serialize("json", archival_sources)
        print(archival_sources_json)
        return HttpResponse(archival_sources_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No archival sources."
        })
        return HttpResponse(response, content_type="application/json")
    

def create_archival_source(request): 
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    archival_source = archivalsource_model.Archival_Source.objects.get_or_create(
        user = user[0],
        archive_name = data['archive_name'], 
        collection_name = data['collection_name'], 
        folder_name = data['folder_name'],
        )
    response = serializers.serialize("json", [archival_source[0], ])
    return HttpResponse(response, content_type='application/json')

def update_archival_source(request): 
    """Method view to login user"""
    pass

 
def delete_archival_source(request): 
    """Method view to logout user"""
    pass
