from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view, textannotation_view
from django.core.urlresolvers import reverse
from django.core import serializers
from django.core.files import File
import json
import cv2
import numpy as np
from skimage import io
import uuid
from sklearn.cluster import KMeans
from PIL import Image


def manual_segmentation(request):
    data = json.loads(request.body.decode())
    file_id = data['transform_file_id']
    file = transformfile_model.Transform_File.objects.get(pk=file_id)
    uri = file.file_url
    coords = data['multi_cords']
    ocr = data['ocr']
    process_type = data['process_type']
    new_image_annotation = coordinates_view.crop_shapes(uri, coords)
    coor_obj = coordinates_model.Coordinates.objects.get_or_create(
                multi_coords=json.dumps(coords)
                )
    rando_numb = uuid.uuid4()
    new_image_annotation_name = 'image_lucida_app/media/transformed_image_annotation' + str(rando_numb)+ '.jpg'
    new_image_annotation = io.imsave(new_image_annotation_name,new_image_annotation),
    open_image = open(new_image_annotation_name, 'rb')
    newest_image_annotation_file = File(open_image)
    image_annotation = imageannotation_model.Image_Annotation.objects.create(
                    transform_file=file,
                    image_annotation_file_name=new_image_annotation_name,
                    )
    image_annotation.image_annotation_file.save(new_image_annotation_name, newest_image_annotation_file, save=True)
    image_annotation.image_annotation_coordinates=coords_obj
    image_annotation.save()
    if ocr == True:
        text_annotation = textannotation_model.Text_Annotation.objects.create(
        transform_file=transform_file)
        text_annotation.text_annotation_coordinates=coords_obj
        text_annotation.save()
        textannotation_view.segment_text(text_annotation.pk, process_type, transform_file_id)
        response = {'success': 'true'}
    else:
        response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def auto_segment_image_annotation(request):
    data = json.loads(request.body.decode())
    file_id = data['transform_file_id']
    file = transformfile_model.Transform_File.objects.get(pk=file_id)
    data = file.file_url
    new_image_annotations = coordinates_view.segment_images(data)
    list_1 =new_image_annotations[0] 
    list_2 = new_image_annotations[1]
    for key, coords in list_1.items():
        for value, image in list_2.items():
            if key == value:
                pts = np.array(list(coords), dtype = "float32")
                coor_obj = coordinates_model.Coordinates.objects.get_or_create(
                multi_coords=json.dumps(pts)
                )
                rando_numb = uuid.uuid4()
                new_image_annotation_name = 'image_lucida_app/media/transformed_image_annotation' + str(rando_numb)+ '.jpg'
                new_image_annotation = io.imsave(new_image_annotation_name,image),
                open_image = open(new_image_annotation_name, 'rb')
                newest_image_annotation_file = File(open_image)
                image_annotation = imageannotation_model.Image_Annotation.objects.create(
                    transform_file=file,
                    image_annotation_file_name=new_image_annotation_name,
                    )
                image_annotation.image_annotation_file.save(new_image_annotation_name, newest_image_annotation_file, save=True)
                image_annotation.image_annotation_coordinates=coords_obj
                image_annotation.save()
                file.auto_image_processed = True
                file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')
    
def transform_image_annotations(request):
    data = json.loads(request.body.decode())
    file_id = data['transform_file_id']
    file = transformfile_model.Transform_File.objects.get(pk=file_id)
    coords = data['four_points']
    print(coords)
    data = file.file_url
    print(data)
    new_image_annotation = coordinates_view.four_point_transform(data, coords)
    rows, cols, ch = new_image_annotation.shape
    coords_obj = coordinates_view.calculate_coordinates(int(rows), int(cols))
    rando_numb = uuid.uuid4()
    new_image_annotation_name = 'image_lucida_app/media/transformed_image_annotation' + str(rando_numb)+ '.jpg'
    new_image_annotation = io.imsave(new_image_annotation_name,new_image_annotation),
    open_image = open(new_image_annotation_name, 'rb')
    newest_image_annotation_file = File(open_image)
    image_annotation = imageannotation_model.Image_Annotation.objects.create(
        transform_file=file,
        image_annotation_file_name=new_image_annotation_name,
        )
    image_annotation.image_annotation_file.save(new_image_annotation_name, newest_image_annotation_file, save=True)
    image_annotation.image_annotation_coordinates=coords_obj
    image_annotation.save()
    file.manual_image_processed = True
    file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def get_image_annotations(request, transform_file_id):
    transform_file = get_object_or_404(transformfile_model.Transform_File, pk=transform_file_id)
    print(transform_file)
    images = transform_file.image_annotation_set.all()
    print(images)
    images_urls = []
    for image in images:
        image_list = []
        image_list.extend({image.image_annotation_file_name, image.file_url})
        images_urls.append(image_list)
    images_serialize = serializers.serialize("json", list(images))
    print(images_serialize)
    response = json.dumps({'images': images_serialize, 'image_urls': images_urls})
    return HttpResponse(response, content_type='application/json') 

def process_image_annotations(request):
    data = json.loads(request.body.decode())
    image_annotation_id = data['image_annotation_id']
    print(image_annotation_id)
    image_annotation = imageannotation_model.Image_Annotation.objects.get_or_create(pk=image_annotation_id)
    image_annotation = image_annotation[0]
    print("test", image_annotation)
    print("url", image_annotation.file_url)
    image = io.imread(image_annotation.file_url)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image.reshape((image.shape[0] * image.shape[1], 3))
    clt = KMeans(n_clusters = 4)
    clt.fit(image)
    hist = coordinates_view.centroid_histogram(clt)
    # print(hist)
    bar = coordinates_view.plot_colors(hist, clt.cluster_centers_)
    print(type(bar))
    new_image = Image.fromarray(bar)
    rando_numb = uuid.uuid4()
    process_image_annotation_name = 'image_lucida_app/media/transformed_image_palette' + str(rando_numb)+ '.jpg'
    io.imsave(process_image_annotation_name,new_image)
    # new_image.save(process_image_annotation_name)
    open_image = open(process_image_annotation_name, 'rb')
    process_image_annotation_file = File(open_image)
    image_annotation.image_palette_file.save(process_image_annotation_name, process_image_annotation_file, save=True)
    image_annotation.save()
    palette_url = image_annotation.palette_url
    image_annotation_serialize = serializers.serialize("json", [image_annotation, ])
    image_json = json.dumps({
        'image_annotation': image_annotation_serialize,
        'palette_url': palette_url
        })
    return HttpResponse(image_json, content_type='application/json')

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

def delete_image_annotation(request):
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        image_anno_id = data['image_anno_id']
        image_anno = get_object_or_404(imageannotation_model.Image_Annotation, pk=image_anno_id)
        print(image_anno)
        image_anno.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")
