from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_statuses(request):
    try:
        statuses = get_list_or_404(status_model.Status)
        print(statuses)
        statuses_json = serializers.serialize("json", [statuses, ])
        print(statuses_json)
        return HttpResponse(statuses_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No statuses."
        })
        return HttpResponse(response, content_type="application/json")