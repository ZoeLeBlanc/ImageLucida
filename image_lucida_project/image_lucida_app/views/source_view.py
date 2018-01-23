from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_sources(request, bucket_id):
    sources =source_model.Source.objects.filter(bucket_id=bucket_id)
    print(len(sources))
    if len(sources) > 0:
        response = serializers.serialize("json", sources)
        print(response)
    else:
        response = json.dumps({
            "error": "No sources."
        })
    return HttpResponse(response, content_type="application/json")

def get_single_source(request, source_id):
    print(source_id)
    source = get_object_or_404(source_model.Source, pk=source_id)
    source_serialize = serializers.serialize("json", [source,])
    source_json = json.dumps({'source': source_serialize})
    print(source_json)
    return HttpResponse(source_json, content_type="application/json")

def cu_source(request):
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    bucket = bucket_model.Bucket.objects.get_or_create(pk=data['bucket_id'])
    source = source_model.Source.objects.update_or_create(
        bucket = bucket[0],
        source_name = data['source_name'].replace(" ", "_"),
        description = data['description']
        )
    response = serializers.serialize("json", [source[0], ])
    return HttpResponse(response, content_type='application/json')

def delete_source(request):
    """Method to delete a folder"""
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        source_id = data['source_id']
        source = get_object_or_404(source_model.Source, pk=source_id)
        print(source)
        source.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")
