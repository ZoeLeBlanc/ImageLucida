import json
import io
import urllib.request
import os
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core import serializers
from google.cloud import vision, translate
from google.cloud.vision import types
import google.auth
from image_lucida_app.models import basefile_model, textfile_model, file_model, imagefile_model
from tesserocr import PyTessBaseAPI, RIL


def process_text(request):
    """Method to create a textfile from image """
    data = json.loads(request.body.decode())
    process_type = data['process_type']
    file_id = data['file_id']
    file_item = file_model.File.objects.get(pk=file_id)
    base_file = basefile_model.BaseFile.objects.get(pk=file_item.base_file.pk)
    text_file = textfile_model.TextFile.objects.get_or_create(
        base_file=base_file,
        )
    text_file = text_file[0]
    segment_type = 'full_page'
    response = segment_text(text_file.pk, process_type, base_file.pk, segment_type)
    return HttpResponse(response, content_type='application/json')

def segment_text(text_file_id, process_type, file_id, segment_type):
    """Method to get model data for oct"""
    text_file = textfile_model.TextFile.objects.get(pk=text_file_id)
    base_file = basefile_model.BaseFile.objects.get(pk=file_id)
    uri = base_file.file_url
    file_name = base_file.base_file_name
    response = analyze_text(base_file, uri, process_type, file_name, text_file, segment_type)
    return response

def analyze_text(file_item, uri, process_type, file_name, text_file, segment_type):
    """Method to determine type of ocr"""
    filename, _ = urllib.request.urlretrieve(uri, file_name)
    if process_type == 'tesseract':
        response = tesseract_ocr(filename, text_file, file_item)
    if process_type == 'googlevision':
        response = googlevision_ocr(segment_type, uri, filename, text_file, file_item)
    return response

def tesseract_ocr(file_name, text_file, file_item):
    """Method to processs text with tesseract"""
    with PyTessBaseAPI() as api:
        api.SetImageFile(file_name)
        boxes = api.GetComponentImages(RIL.TEXTLINE, True)
        text_file_text = api.GetUTF8Text()
        text_file.tesseract_text = text_file_text
        tesseract_response = {}
        for i, (_, box, _, _) in enumerate(boxes):
            ocr_result = api.GetUTF8Text()
            conf = api.MeanTextConf()
            tesseract_response[i] = {}
            tesseract_response[i]['ocrResult'] = ocr_result
            tesseract_response[i]['confidence'] = conf
            tesseract_response[i]['box'] = box
        text_file.tesseract_response = tesseract_response
        text_file.save()
        if file_item.tesseract_processed is False:
            file_item.tesseract_processed = True
            file_item.save()
        return serializers.serialize("json", [text_file, ])

def googlevision_ocr(segment_type, uri, file_name, text_file, file_item):
    """Method to process with google vision"""
    _, _ = google.auth.default()
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
            else:
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
            else:
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
    if file_item.google_vision_processed is False:
        file_item.google_vision_processed = True
        file_item.save()
        os.remove(file_name)
    return serializers.serialize("json", [text_file, ])

def get_single_text_file(request, text_file_id):
    text_file = get_object_or_404(textfile_model.TextFile, pk=text_file_id)
    text_file_serialize = serializers.serialize("json", [text_file, ])
    text_file_json = json.dumps({
        'text_file':text_file_serialize,
        })
    return HttpResponse(text_file_json, content_type='application/json')

def update_text_file(request):
    data = json.loads(request.body.decode())
    new_text = data['new_text']
    process_type = data['process_type']
    text_file = textfile_model.TextFile.objects.get(pk=data['text_file_id'])
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
    if request.method == 'DELETE':
        data = json.loads(request.body.decode())
        text_file_id = data['text_file_id']
        text_file = get_object_or_404(textfile_model.TextFile, pk=text_file_id)
        text_file.delete()
        response = {'success':True}
        return HttpResponse(response, content_type="application/json")

def translate_text_file(request):
    data = json.loads(request.body.decode())
    process_type = data['process_type']
    source_lang = 'ar'
    if process_type == 'full_page':
        file_id = data['file_id']
        file_item = file_model.File.objects.get(pk=file_id)
        base_file = basefile_model.BaseFile.objects.get(pk=file_item.base_file.pk)
        text_files = textfile_model.TextFile.objects.filter(
            base_file_id=base_file.pk
            )
    if process_type == 'segment_page':
        image_file_id = data['file_id']
        image_file = imagefile_model.ImageFile.objects.get(pk=image_file_id)
        base_file = basefile_model.BaseFile.objects.get(pk=image_file.base_file.pk)
        text_files = textfile_model.TextFile.objects.filter(
            base_file_id=base_file.pk
            )
    for t_x in text_files:
        translate_all_texts(t_x.pk, source_lang)
    text_files = textfile_model.TextFile.objects.filter(base_file_id=base_file.pk)
    textfiles_json = serializers.serialize("json", text_files)
    return HttpResponse(textfiles_json, content_type="application/json")

def translate_all_texts(t_x, source_lang):
    t_file = textfile_model.TextFile.objects.get(pk=t_x)
    text = t_file.google_vision_text
    translate_client = translate.Client()
    result = translate_client.translate(text, target_language='en', source_language=source_lang)
    t_file.google_translate_text = result['translatedText']
    t_file.google_translate_text_response = result
    t_file.save()
