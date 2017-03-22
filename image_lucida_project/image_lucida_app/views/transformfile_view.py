from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core.urlresolvers import reverse
from django.core import serializers
import json
import cv2
import numpy as np

def transform_upload_file(request):
    data = json.loads(request.body.decode())
    file_name = data['upload_file_name']
    print(file_name)
    file = uploadfile_model.Upload_File.objects.get(upload_file_name=file_name)
    print(file.file_url)
    coords = data['four_points']
    # print(coords)
    # test_coords = np.array(coords)
    # print(test_coords)
    new_file = coordinates_view.four_point_transform(file, coords)
    # print(new_file) 
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')
    # 
    # four_point_transform(image, points)