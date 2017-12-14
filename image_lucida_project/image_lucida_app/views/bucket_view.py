from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_buckets(request):
    try:
        buckets = get_list_or_404(bucket_model.Bucket)
        print(buckets)
        buckets_json = serializers.serialize("json", [buckets, ])
        print(buckets_json)
        return HttpResponse(buckets_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No buckets."
        })
        return HttpResponse(response, content_type="application/json")

def create_bucket(request):
    data = json.loads(request.body.decode())
    bucket = bucket_model.Bucket.objects.get_or_create(
        bucket_name = data['bucket_name'],
        bucket_type = data['bucket_type'],
        )
    response = serializers.serialize("json", [bucket[0], ])
    return HttpResponse(response, content_type='application/json')

def update_bucket(request):
    pass

def delete_bucket(request):
    pass
