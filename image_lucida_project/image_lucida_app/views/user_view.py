from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt

def auth_user(request):
    """Method to authorize user. Currently disabled"""
    print('user', request.COOKIES, request.user)
    if request.user.is_authenticated:
        response = json.dumps({"user":True, "username":request.user.username})
    else:
        response = json.dumps({"user":False})
    return HttpResponse(response, content_type='application/json')

def register_user(request):
    """Method view to register new user"""
    data = json.loads(request.body.decode())
    user = User.objects.create_user(
        username = data['username'],
        password = data['password'],
        email = data['email'],
        first_name = data['first_name'],
        last_name = data['last_name']
        )
    user.save()
    return login_user(request)
    
@csrf_exempt
def login_user(request):
    """Method view to login user"""
    data = json.loads(request.body.decode())
    username = data['username']
    password = data['password']
    user = authenticate(
        username = username,
        password = password
        )
    print('login', user)
    if user is not None:
        login(request = request, user = user)
        user_json = serializers.serialize("json", [user, ])
        return HttpResponse(user_json, content_type='application/json')
    else:
        user_json = json.dumps({'user':False})
        return HttpResponse(user_json, content_type='application/json')


def logout_user(request):
    """Method view to logout user"""
    logout(request)
    response = json.dumps({'logout': True})
    return HttpResponse(response, content_type='application/json')
