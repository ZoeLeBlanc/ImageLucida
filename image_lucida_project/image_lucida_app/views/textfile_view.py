from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from . import coordinates_view
from django.core import serializers
from django.core.files import File
import json
import cv2
import numpy as np
import io
import uuid
from tesserocr import PyTessBaseAPI, RIL
from google.cloud import vision, translate
from google.cloud.vision import types
import google.auth
from protobuf_to_dict import protobuf_to_dict
from google.protobuf.json_format import MessageToJson
import urllib.request
import os


def process_text(request):
    data = json.loads(request.body.decode())
    process_type = data['process_type']
    file_id=data['file_id']
    print(file_id)
    file_item = file_model.File.objects.get(pk=file_id)
    base_file = basefile_model.Base_File.objects.get(pk=file_item.base_file.pk)
    text_file = textfile_model.Text_File.objects.get_or_create(
            base_file=base_file,
        )
    text_file = text_file[0]
    segment_type = 'full_page'
    response = segment_text(text_file.pk, process_type, base_file.pk, segment_type)
    return HttpResponse(response, content_type='application/json')

def segment_text(text_file_id, process_type, file_id, segment_type):
    text_file = textfile_model.Text_File.objects.get(pk=text_file_id)
    base_file = basefile_model.Base_File.objects.get(pk=file_id)
    uri = base_file.file_url
    file_name = base_file.base_file_name
    response = analyze_text(base_file, uri, process_type, file_name, text_file, segment_type)
    return response

def analyze_text(file_item, uri, process_type, file_name, text_file, segment_type):
    filename, headers = urllib.request.urlretrieve(uri, file_name)
    print(filename)
    if process_type == 'tesseract':
        with PyTessBaseAPI() as api:
            api.SetImageFile(file_name)
            boxes = api.GetComponentImages(RIL.TEXTLINE, True)
            text_file_text = api.GetUTF8Text()
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
        vision_client = vision.ImageAnnotatorClient()
        image = types.Image()
        image.source.image_uri = uri
        if segment_type == 'full_page':
            response = vision_client.document_text_detection(image=image)
            if response.error:
                with io.open(file_name, 'rb') as image_file:
                    content = image_file.read()
                    image = types.Image(content=content)
                    response = vision_client.document_text_detection(image=image)
            texts = response.text_annotations
            text_list = " "
            text_data = {}
            for index, text in enumerate(texts):
                if index == 0:
                    word = text.description + " "
                    text_list += word
                else :
                    text_coords = []
                    for vertice in text.bounding_poly.vertices:
                        dict_text = {}
                        dict_text['x'] = vertice.x
                        dict_text['y'] = vertice.y
                        text_coords.append(dict_text)
                    text_data[text.description] = text_coords
            text_file.google_vision_text = text_list
            text_file.google_vision_response = text_data
            text_file.save()
        if segment_type == 'segment_page':
            response = client.text_detection(image=image)
            response = vision_client.text_detection(image=image)
            if response.error:
                with io.open(file_name, 'rb') as image_file:
                    content = image_file.read()
                    image = types.Image(content=content)
                    response = vision_client.text_detection(image=image)
            texts = response.text_annotations
            text_list = " "
            text_data = {}
            for index, text in enumerate(texts):
                if index == 0:
                    word = text.description + " "
                    text_list += word
                else :
                    text_coords = []
                    for vertice in text.bounding_poly.vertices:
                        dict_text = {}
                        dict_text['x'] = vertice.x
                        dict_text['y'] = vertice.y
                        text_coords.append(dict_text)
                    text_data[text.description] = text_coords
            text_file.google_vision_text = text_list
            text_file.google_vision_response = text_data
            text_file.save()

        if file_item.google_vision_processed == False:
            file_item.google_vision_processed = True
            file_item.save()
        os.remove(filename)
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
    if process_type == 'google_vision':
        text_file.google_vision_text = new_text
        text_file.save()
    if process_type == 'tesseract':
        text_file.tesseract_text = new_text
        text_file.save()
    if process_type == 'translate_text':
        text_file.google_translate_text = new_text
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

def translate_text_file(request):
    data = json.loads(request.body.decode())
    file_id=data['file_id']
    file_item = file_model.File.objects.get(pk=file_id)
    base_file = basefile_model.Base_File.objects.get(pk=file_item.base_file.pk)
    text_files = textfile_model.Text_File.objects.filter(base_file_id=base_file.pk)
    for tx in text_files:
        text = tx.google_vision_text
        translate_client = translate.Client()
        result = translate_client.translate(text, target_language='en')
        print(result)
        tx.google_translate_text = result['translatedText']
        tx.google_translate_text_response = result
        tx.save()
    textfiles_json = serializers.serialize("json", text_files)
    return HttpResponse(textfiles_json, content_type="application/json")
