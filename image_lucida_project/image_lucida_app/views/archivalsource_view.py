from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_all_archival_sources(request):
    try:
        archival_sources = get_list_or_404(archivalsource_model.Archival_Source, user=request.user.pk)
        print(archival_sources)
        response = serializers.serialize("json", archival_sources)
    except:
        response = json.dumps({
            "error": "No archival sources."
        })
    return HttpResponse(response, content_type="application/json")

def get_file_archival_sources(request, transform_file_id):
    archival_sources = archivalsource_model.Archival_Source.objects.filter(transform_file=transform_file_id)
    print(archival_sources)
    response= serializers.serialize("json", archival_sources)
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
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    archival_source = archivalsource_model.Archival_Source.objects.update_or_create(
        user = user[0],
        archive_name = data['archive_name'], 
        collection_name = data['collection_name'], 
        folder_name = data['folder_name'],
        )
    response = serializers.serialize("json", [archival_source[0], ])
    return HttpResponse(response, content_type='application/json')

 
def delete_archival_source(request): 
    """Method to delete a folder"""
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        archival_source_id = data['archival_source_id']
        archival_source = get_object_or_404(archivalsource_model.Archival_Source, pk=archival_source_id)
        print(archival_source)
        archival_source.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")