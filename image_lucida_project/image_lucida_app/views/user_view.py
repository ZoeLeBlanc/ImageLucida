from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from django.core.urlresolvers import reverse

class LoginView(TemplateView): 
    """Template for Login"""
    template_name = "image_lucida_app/login.html"

class RegisterView(TemplateView):
    """Template for Register"""
    template_name = "image_lucida_app/register.html" 

def register_user(request): 
    """Method view to register new user"""
    data = request.POST
    user = User.objects.create_user(
        username = data['username'], 
        password = data['password'], 
        email = data['email'], 
        first_name = data['first_name'],
        last_name = data['last_name']
        )
    return login_user(request)

def login_user(request): 
    """Method view to login user"""
    data = request.POST
    username = data['username']
    password = data['password']
    user = authenticate(
        username = username, 
        password = password
        ) 
    if user is not None: 
        login(request = request, user = user)
    else: 
        return HttpResponseRedirect(redirect_to='/')
    return HttpResponseRedirect(redirect_to='/projects/')

 
def logout_user(request): 
    """Method view to logout user"""
    logout(request) 
    return HttpResponseRedirect(redirect_to='/')
