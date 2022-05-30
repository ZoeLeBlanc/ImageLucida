from django.contrib import admin
from django.contrib.auth.models import User
from image_lucida_app.models import *

admin.site.unregister(User)
admin.site.register(User)
admin.site.register(project_model.Project)
