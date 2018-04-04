from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view, textfile_view
from django.core import serializers
from django.core.files import File
import json
import cv2
import numpy as np
from skimage import io
import uuid
from sklearn.cluster import KMeans
from PIL import Image
import os

def manual_segmentation(request):
    data = json.loads(request.body.decode())
    file_item = file_model.File.objects.get(pk=data['file_id'])
    base_file = basefile_model.Base_File.objects.get(pk=file_item.base_file)
    uri = file_item.file_url
    coords = data['multi_coords']
    ocr = data['ocr']
    process_type = data['process_type']
    height = data['height']
    width = data['width']
    index = data['index']
    image= coordinates_view.crop_shapes(uri, coords, height, width)
    array_image = Image.fromarray(np.uint8(image))
    bounded_image = array_image.getbbox()
    new_image_file = array_image.crop(bounded_image)
    coords_obj = coordinates_model.Coordinates.objects.create(
        multi_coords=json.dumps(coords)
    )
    images = file_item.image_file_set.all().count()
    image_number = data['index']
    rando_numb = uuid.uuid4()
    base_file_name = 'image_lucida_app/media/'+base_file.base_file_name.split('.jpg')[0] +'_imagefile_'+str(image_number) + '.jpg'
    new_image_file_name =  file_item.file_name.split('.jpg')[0] +'_imagefile_'+str(image_number) + '.jpg'
    new_image_file = new_image_file.save(base_file_name)
    open_image = open(base_file_name, 'rb')
    newest_image_file = File(open_image)
    new_base_file = basefile_model.Base_File.objects.create(
        transformed_file=base_file,
        base_file_name=base_file_name,
        height=height,
        width=width,
        base_file_coordinates=coords_obj,
    )
    image_file = imagefile_model.Image_File.objects.create(
        file_item=file_item,
        image_file_name=new_image_file_name,
        base_file=new_base_file
    )
    new_base_file.base_file.save(base_file_name, new_image_file, save=True)
    new_base_file.manual_image_processed=True
    new_base_file.save()
    image_file.save()
    # os.remove(image_file.image_file_name)
    if ocr == True:
        text_file = textfile_model.Text_File.objects.get_or_create(
        base_file=new_base_file,
        )
        textfile_view.segment_text(text_file[0].pk, process_type, base_file.pk)
        response = {'success': 'true'}
    else:
        response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def image_process_text(request):
    data = json.loads(request.body.decode())
    image_file = imagefile_model.Image_File.objects.get(pk=data['image_file_id'])
    process_type = data['process_type']
    base_file = basefile_model.Base_File.objects.get(pk=image_file.base_file)
    text_file = textfile_model.Text_File.objects.get_or_create(
    base_file=base_file,
    )
    text_file.save()
    segment_type = 'segment_page'
    response = textfile_view.segment_text(text_file[0].pk, process_type, base_file.pk, segment_type)
    return HttpResponse(response, content_type='application/json')

def auto_segment_image_file(request):
    data = json.loads(request.body.decode())
    file_item = file_model.File.objects.get(pk=data['file_id'])
    base_file = basefile_model.Base_File.objects.get(pk=file_item.base_file.pk)
    if base_file.auto_image_processed == False :
        data = base_file.file_url
        new_image_files = coordinates_view.segment_images(data)
        list_1 =new_image_files[0]
        list_2 = new_image_files[1]
        for key, coords in list_1.items():
            for value, image in list_2.items():
                if key == value:
                    pts = np.array(list(coords), dtype = "float32")
                    coords_obj = coordinates_model.Coordinates.objects.get_or_create(
                    multi_coords=json.dumps(pts.tolist())
                    )
                    images = file_item.image_file_set.all().count()
                    image_number = images + 1
                    new_image_file_name = file_item.file_name.split('.jpg')[0] + '_auto_image_file_'+str(image_number) + '.jpg'
                    rando_numb = uuid.uuid4()
                    base_file_name =base_file.base_file_name.split('.jpg')[0] +'_imagefile_'+str(image_number) + '.jpg'
                    new_image_file = io.imsave(base_file_name,image),
                    open_image = open(base_file_name, 'rb')
                    newest_base_file = File(open_image)
                    new_base_file = basefile_model.Base_File.objects.create(
                        transformed_file=base_file,
                        base_file_name=base_file_name,
                        base_file_coordinates=coords_obj[0],
                    )
                    image_file = imagefile_model.Image_File.objects.create(
                        base_file=new_base_file,
                        file_item=file_item,
                        image_file_name=new_image_file_name,
                    )

                    new_base_file.base_file.save(base_file_name, newest_base_file, save=True)
                    image_file.save()
                    base_file.auto_image_processed = True
                    base_file.save()
                    new_base_file.assigned = True
                    new_base_file.save()
                    file_item.save()
        response = {'success': True}
    else :
        response = {'success': False}
        print(response)
    return HttpResponse(response, content_type='application/json')

def get_single_image_file(request, image_file_id):
    image_file = get_object_or_404(imagefile_model.Image_File, pk=image_file_id)
    base_file = basefile_model.Base_File.objects.get(pk=image_file.base_file.pk)
    texts = base_file.text_file_set.all()
    image_serialize = serializers.serialize("json", [image_file,], indent=2, use_natural_foreign_keys=True, use_natural_primary_keys=True)
    texts_serialize = serializers.serialize("json", list(texts))
    tags = image_file.tags.all()
    tags_serialize = {}
    if len(tags)>0:
        tags_serialize = serializers.serialize("json", list(tags))
    image_file_url = base_file.file_url
    image_json = json.dumps({'image': image_serialize, 'texts':texts_serialize, 'tags': tags_serialize, 'image_file_url':image_file_url})
    return HttpResponse(image_json, content_type="application/json")

def tag_images(request):
    data = json.loads(request.body.decode())
    tag = tag_model.Tag.objects.get_or_create(tag_name=data['tag_name'])
    image_file = imagefile_model.Image_File.objects.get(pk=data['image_file_id'])
    tag_image_file = imagefile_model.Image_File_Tag.objects.get_or_create(
        tag =tag[0],
        image_file = image_file
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def order_image(request):
    data = json.loads(request.body.decode())
    image_file = imagefile_model.Image_File.objects.get(pk=data['image_file_id'])
    image_file.image_order = data['image_order']
    image_file.save()
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def delete_image_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        try:
            image_file = get_object_or_404(imagefile_model.Image_File, pk=data['image_file_id'])
            print(image_file)
            image_file.image_file.delete(save=False)
            image_file.delete()
            response = {'success':True}
        except:
            response = {'success':False}
        return HttpResponse(response, content_type="application/json")
