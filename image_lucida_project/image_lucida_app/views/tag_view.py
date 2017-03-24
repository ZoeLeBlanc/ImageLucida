from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_tags(request):
    tags = tag_model.Tag.objects.all()
    print(tags)
    tags_json = serializers.serialize("json", tags)
    print(tags_json)
    return HttpResponse(tags_json, content_type="application/json")

def create_new_tag(request):
    data = json.loads(request.body.decode())
    tag_name = data['tag_name']
    tag = tag_model.Tag.objects.get_or_create(
        tag_name=tag_name
        )
    response = serializers.serialize("json", [tag[0], ])
    return HttpResponse(response, content_type='application/json')
