from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def caculate_coordinates(img_rows, img_cols):
    top_left = [0,0]
    top_right = [0,img_cols-1]
    bottom_left = [img_rows-1,0]
    bottom_right = [img_rows-1, img_cols-1]
    coor_obj = coordinates_model.Coordinates.objects.create(
        top_left=json.dumps(top_left),
        top_right=json.dumps(top_right),
        bottom_left=json.dumps(bottom_left),
        bottom_right=json.dumps(bottom_right)
        )
    return coor_obj