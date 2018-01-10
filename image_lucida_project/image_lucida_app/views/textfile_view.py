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
from tesserocr import PyTessBaseAPI, RIL
from google.cloud import vision
from google.cloud.vision import types
import google.auth

def process_text(request):
    data = json.loads(request.body.decode())
    process_type = data['process_type']
    file_id=data['file_id']
    print(file_id)
    file_item = file_model.File.objects.get(pk=file_id)
    text_file = textfile_model.Text_File.objects.create(
            file_item=file_item,
        )
    segment_type = 'full_page'
    print(text_file)
    response = segment_text(text_file.pk, process_type, file_id, segment_type)
    return HttpResponse(response, content_type='application/json')

def segment_text(text_file_id, process_type, file_id, segment_type):
    text_file = textfile_model.Text_File.objects.get(pk=text_file_id)
    if segment_type =='full_page':
        file_item = file_model.File.objects.get(pk=file_id)
        uri = file_item.file_url
        file_name = file_item.file_name
        response = analyze_text(file_item, uri, process_type, file_name, text_file)
        return response
    if segment_type == 'image_file':
        image_file = imagefile_model.Image_File.objects.get(pk=file_id)
        uri = image_file.file_url
        image_file_name = image_file.image_file_name
        response = analyze_text(image_file, uri, process_type, file_name, text_file)
        return response

def analyze_text(file_item, uri, process_type, file_name, text_file):
    print(process_type)
    print(file_item.google_vision_processed)
    if process_type == 'tesseract':
        with PyTessBaseAPI() as api:
            api.SetImageFile(file_name)
            boxes = api.GetComponentImages(RIL.TEXTLINE, True)
            text_file_text = api.GetUTF8Text()
            print(text_file_text)
            text_file.tesseract_text = text_file_text

            tesseract_response = {}
            for i, (im, box, _, _) in enumerate(boxes):
                ocrResult = api.GetUTF8Text()
                conf = api.MeanTextConf()
                tesseract_response[i] = {}
                tesseract_response[i]['ocrResult'] = ocrResult
                tesseract_response[i]['confidence'] = conf
                tesseract_response[i]['box'] = box
            text_file.tesseract_response = tesseract_response
            text_file.save()
        if file_item.tesseract_processed == False:
            file_item.tesseract_processed = True
            file_item.save()
        return serializers.serialize("json", [text_file, ])
    if process_type == 'googlevision':
        credentials, project = google.auth.default()
        vision_client = vision.Client()
        image = types.Image()
        image.source.image_uri = uri
        # image = vision_client.Image(source_uri=uri)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        # texts = image.detect_text()
        text_list = " "
        for text in texts:
            word = text.description + " "
            text_list += word
        print(text_list)
        text_file.google_vision_text_file = text_list
        text_file.google_vision_response = texts
        text_file.save()
        if file_item.google_vision_processed == False:
            file_item.google_vision_processed = True
            file_item.save()
        return serializers.serialize("json", [text_file, ])

def get_single_text_file(request, text_file_id):
    text_file = get_object_or_404(textfile_model.Text_File, pk=text_file_id)
    text_file_serialize = serializers.serialize("json", [text_file, ])
    text_file_json = json.dumps({
        'text_file':text_file_serialize,
        })
    return HttpResponse(text_file_json, content_type='application/json')

def update_text_file(request):
    data = json.loads(request.body.decode())
    new_text = data['new_text']
    process_type = data['process_type']
    text_file = textfile_model.Text_File.objects.get(pk=data['text_file_id'])
    if process_type == 'googlevision':
        text_file.google_vision_text = new_text
        text_file.save()
    if process_type == 'tesseract':
        text_file.tesseract_text = new_text
        text_file.save()
    text_file_serialize = serializers.serialize("json", [text_file, ])
    response = json.dumps({
        'text_file':text_file_serialize,
        })
    return HttpResponse(response, content_type='application/json')

def delete_text_file(request):
    if request.method=='DELETE':
        data = json.loads(request.body.decode())
        text_file_id = data['text_file_id']
        text_file = get_object_or_404(textfile_model.Text_File, pk=text_file_id)
        print(text_file)
        text_file.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")