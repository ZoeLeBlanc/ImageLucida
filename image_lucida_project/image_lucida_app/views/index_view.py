from django.shortcuts import get_object_or_404, render

def index(request):
    """
    The index view maps the url index.html to the data that it needs.

    """
    
    return render(request, 'image_lucida_app/index.html')

