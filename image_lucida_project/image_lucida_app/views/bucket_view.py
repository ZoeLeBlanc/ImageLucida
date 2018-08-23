import json
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core import serializers
from image_lucida_app.models import bucket_model, folder_model


def get_buckets(request, folder_id):
    print(request)
    buckets_list = bucket_model.Bucket.objects.filter(folder_id=folder_id)
    if buckets_list:
        buckets = serializers.serialize("json", buckets_list)
        return HttpResponse(buckets, content_type="application/json")
    else:
        response = json.dumps({
            "error": "No buckets."
        })
        return HttpResponse(response, content_type="application/json")

def get_single_bucket(request, bucket_id):
    """Needs to retrieve single bucket"""
    print(bucket_id, request)
    bucket = get_object_or_404(bucket_model.Bucket, pk=bucket_id)
    bucket_serialize = serializers.serialize("json", [bucket,], indent=2, use_natural_foreign_keys=True, use_natural_primary_keys=True)
    bucket_json = json.dumps({'bucket': bucket_serialize})
    print(bucket_json)
    return HttpResponse(bucket_json, content_type="application/json")

def cu_bucket(request):
    data = json.loads(request.body.decode())
    folder = folder_model.Folder.objects.get_or_create(pk=data['folder_id'])
    bucket = bucket_model.Bucket.objects.update_or_create(
        bucket_name=data['bucket_name'].replace(" ", "_"),
        description=data['bucket_description'].replace(" ", "_"),
        folder=folder[0]
        )
    response = serializers.serialize("json", [bucket[0], ])
    return HttpResponse(response, content_type='application/json')

def delete_bucket(request):
    """Method to delete a folder"""
    if request.method == 'DELETE':
        data = json.loads(request.body.decode())
        bucket_id = data['bucket_id']
        bucket = get_object_or_404(bucket_model.Bucket, pk=bucket_id)
        print(bucket)
        bucket.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")
