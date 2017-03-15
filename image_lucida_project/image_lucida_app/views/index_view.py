from django.shortcuts import render
from django.views.generic.base import TemplateView

class IndexView(TemplateView): 
    """Template for Login"""
    template_name = "image_lucida_app/index.html"