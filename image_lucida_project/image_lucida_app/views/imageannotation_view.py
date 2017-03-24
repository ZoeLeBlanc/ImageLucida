from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core.urlresolvers import reverse
from django.core import serializers
from django.core.files import File
import json
import cv2
import numpy as np
from skimage import io
import uuid
from sklearn.cluster import KMeans

def transform_image_annotations(request):
    data = json.loads(request.body.decode())
    file_id = data['transform_file_id']
    file = transformfile_model.Transform_File.objects.get(pk=file_id)
    coords = data['four_points']
    data = file.file_url
    new_image_annotation = coordinates_view.four_point_transform(data, coords)
    rows, cols, ch = new_image_annotation.shape
    coords_obj = coordinates_view.calculate_coordinates(int(rows), int(cols))
    rando_numb = uuid.uuid4()
    new_image_annotation_name = 'image_lucida_app/media/transformed_image_annotation' + str(rando_numb)+ '.jpg'
    new_image_annotation = io.imsave(new_image_annotaiton_name,new_image_annotation),
    open_image = open(new_image_annotaiton_name, 'rb')
    newest_image_annotation_file = File(open_image)
    image_annotation = imageannotation_model.Image_Annotation.objects.create(
        transform_file=file,
        image_annotation_file_name=new_image_annotation_name,
        )
    image_annotation.image_annotation_file.save(new_image_annotation_name, newest_image_annotation_file, save=True)
    image_annotation.image_annotation_coordinates=coords_obj
    image_annotation.save()
    print(image_annotation)
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def process_image_annotations(request):
    data = json.loads(request.body.decode())
    image_annotation_id = data['image_annotation_id']
    image_annotation = imageannotation_model.Image_Annotation.objects.get(pk=image_annotation_id)
    image = io.imread(image_annotation.file_url)
    image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    clt = KMeans(n_clusters = 4)
    clt.fit(image)
    hist = centroid_histogram(clt)
    # print(hist)
    bar = plot_colors(hist, clt.cluster_centers_)
    print(type(bar))
    new_bar = Image.fromarray(bar)
    new_bar.save('new_bar.jpg')

def tag_image_annotation(request):
    data = json.loads(request.body.decode())
    image_anno_id = data['image_anno_id']
    tag_name = data['tag_name']
    tag = get_object_or_404(tag_model.Tag, tag_name=tag_name)
    image_anno = get_object_or_404(imageannotation_model.Image_Annotation, pk=image_anno_id)
    tag_image_annotation = imageannotation_model.Image_Annotation_Tag.objects.get_or_create(
        tag =tag,
        image_annotation = image_anno
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')