from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json

def get_all_issues(request):
    try:
        issues = get_list_or_404(issue_model.Issue, user=request.user.pk)
        print(issues)
        issues_json = serializers.serialize("json", issues)
        print(issues_json)
        return HttpResponse(issues_json, content_type="application/json")
    except:
        response = json.dumps({
            "error": "No issues."
        })
        return HttpResponse(response, content_type="application/json")

def get_file_issues(request, transform_file_id):
    issues = issue_model.Issue.objects.filter(transform_file=transform_file_id)
    print(issues)
    issues_json = serializers.serialize("json", issues)
    return HttpResponse(issues_json, content_type="application/json")


def create_issue(request): 
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    issue = issue_model.Issue.objects.get_or_create(
        user = user[0],
        issue_name = data['issue_name'], 
        date_published = data['date_published'], 
        publication_location = data['publication_location'],
        issue_number = data['issue_number'],
        )
    response = serializers.serialize("json", [issue[0], ])
    return HttpResponse(response, content_type='application/json')

def update_issue(request): 
    data = json.loads(request.body.decode())
    user = User.objects.get_or_create(username=request.user)
    issue = issue_model.Issue.objects.update_or_create(
        user = user[0],
        issue_name = data['issue_name'], 
        date_published = data['date_published'], 
        publication_location = data['publication_location'],
        issue_number = data['issue_number'],
        )
    response = serializers.serialize("json", [issue[0], ])
    return HttpResponse(response, content_type='application/json')
 
def delete_issue(request): 
    """Method to delete a folder"""
    if request.method=='DELETE': 
        data = json.loads(request.body.decode())
        issue_id = data['issue_id']
        issue = get_object_or_404(issue_model.Issue, pk=issue_id)
        print(issue)
        issue.delete()
        response = {'success':'True'}
        return HttpResponse(response, content_type="application/json")
