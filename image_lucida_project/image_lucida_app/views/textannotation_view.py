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
from tesserocr import PyTessBaseAPI
from google.cloud import vision
import google.auth

def process_text(request):
    data = json.loads(request.body.decode())
    transform_file_id = data['transform_file_id']
    process_type = data['process_type']
    transform_file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
    text_annotation = textannotation_model.Text_Annotation.objects.get_or_create(
            transform_file=transform_file,
        )
    segment_type = 'full_page'
    response = segment_text(text_annotation[0].pk, process_type, transform_file_id, segment_type)
    # response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def segment_text(text_anno_id, process_type, file_id, segment_type):
    text_anno = textannotation_model.Text_Annotation.objects.get(pk=text_anno_id)
    if segment_type =='full_page':
        file = transformfile_model.Transform_File.objects.get(pk=transform_file_id)
        uri = file.file_url
        file_name = file.transform_file_name
        response = analyze_text(file, uri, process_type, file_name)
        return response
    if segment_type == 'image_annotation':
        file = imageannotation_model.Image_Annotation.objects.get(pk=file_id)
        uri = file.file_url
        file_name = file.image_annotation_file_name
        print(file_name)
        response = analyze_text(file, uri, process_type, file_name, text_anno)
        return response

def analyze_text(file, uri, process_type, file_name, text_anno):
    print(process_type)
    print(file.google_vision_processed)
    if process_type == 'tesseract':
        with PyTessBaseAPI() as api:
            api.SetImageFile(file_name)
            text_annotation_text = api.GetUTF8Text(file_name)
            text_anno.tesseract_text_annotation = text_annotation_text
            text_anno.save()
        if file.tesseract_processed == False:
            file.tesseract_processed = True
            file.save()      
        return serializers.serialize("json", [text_anno, ])
    if process_type == 'googlevision':
        credentials, project = google.auth.default() 
        vision_client = vision.Client()
        image = vision_client.image(source_uri=uri)
        texts = image.detect_text()
        text_list = " "
        for text in texts:
            word = text.description + " "
            text_list += word
        print(text_list)
        text_anno.google_vision_text_annotation = text_list
        text_anno.save()
        if file.google_vision_processed == False:
            file.google_vision_processed = True 
            file.save()   
        return serializers.serialize("json", [text_anno, ])

def get_text_anno_and_file(request, text_anno_id):
    print(text_anno_id)
    text_annotation = get_object_or_404(textannotation_model.Text_Annotation, pk=text_anno_id)
    print(text_annotation)
    transform_file = text_annotation.transform_file
    print(transform_file)
    transform_file_url = transform_file.file_url
    text_annotation_serialize = serializers.serialize("json", [text_annotation, ])
    transform_file_serialize = serializers.serialize("json", [transform_file, ])
    text_anno_json = json.dumps({
        'text_anno':text_annotation_serialize,
        'transform_file':transform_file_serialize,
        'transform_file_url':transform_file_url
        })
    return HttpResponse(text_anno_json, content_type='application/json')

def update_text_annotation(request):
    data = json.loads(request.body.decode())
    text_anno_id = data['text_anno_id']
    new_text = data['new_text']
    process_type = data['process_type']
    text_anno = get_object_or_404(textannotation_model.Text_Annotation, pk=text_anno_id)
    text_annotation = text_anno
    if process_type == 'googlevision':
        text_annotation.google_vision_text_annotation = new_text
        text_annotation.save()
    if process_type == 'tesseract':
        text_annotation.tesseract_text_annotation = new_text
        text_annotation.save()
    response = serializers.serialize("json", [text_annotation, ])
    return HttpResponse(response, content_type='application/json')

def tag_text_annotation(request):
    data = json.loads(request.body.decode())
    text_anno_id = data['text_anno_id']
    tag_name = data['tag_name']
    tag = get_object_or_404(tag_model.Tag, tag_name=tag_name)
    text_anno = get_object_or_404(textannotation_model.Text_Annotation, pk=text_anno_id)
    tag_text_annotation = textannotation_model.Text_Annotation_Tag.objects.get_or_create(
        tag =tag,
        text_annotation = text_anno
        )
    response = {'success': 'true'}
    return HttpResponse(response, content_type='application/json')

def delete_text_annotation(request):
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        text_anno_id = data['text_anno_id']
        text_anno = get_object_or_404(textannotation_model.Text_Annotation, pk=text_anno_id)
        print(text_anno)
        text_anno.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def get_text_annotations(request, transform_file_id):
    transform_file = get_object_or_404(transformfile_model.Transform_File, pk=transform_file_id)
    print("transform_file", transform_file.pk)
    texts = transform_file.text_annotation_set.all()
    print("texts", texts)
    texts_serialize = serializers.serialize("json", list(texts))
    response = json.dumps({'texts': texts_serialize})
    return HttpResponse(response, content_type='application/json') 