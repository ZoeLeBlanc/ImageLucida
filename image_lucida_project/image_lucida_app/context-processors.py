from image_lucida_app.models import *
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User

def navigation(context):
    """
    The navigation context processor generates the dynamic navbar for the index.html template.

    """
    if context.user.is_authenticated():
            welcome_message = 'Welcome '+user.username
            list_of_nav = [ 
                {
                    'name':'Projects',
                    'link': '/projects/',
                    'prop': 'right',
                    'nav-loc': 'main'
                },
                {
                    'name':'Play',
                    'link': '/play/',
                    'prop': 'right',
                    'nav-loc': 'main'
                },
                {
                    'name': 'Profile',
                    'link': '/profile/',
                    'prop': 'right',
                    'nav-loc': 'main'
                },
                {
                    'name': welcome_message,
                    'link': '#',
                    'nav-loc': 'side'
                },
                {
                    'name':'Logout',
                    'link': '/logout/',
                    'nav-loc': 'side'
                },
            ]
    else:
        # if user is not logged in show 0 next to cart
        list_of_nav = [
                {
                    'name':'Register',
                    'link': '/register/'
                },
                {
                    'name':'Login',
                    'link': '/login/'
                }
            ]
    return {'navigation': list_of_nav}
    