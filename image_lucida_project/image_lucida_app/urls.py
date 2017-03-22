from django.conf.urls import url, include
from django.contrib import admin
from image_lucida_app.views import * 



app_name = 'image_lucida_app'
urlpatterns = [
    url(r'^$', index_view.index, name='index'),
    url(r'^auth_user/', user_view.auth_user, name='auth_user'),
    url(r'^register_user/', user_view.register_user, name='register_user'),
    url(r'^login_user/', user_view.login_user, name='login_user'),
    url(r'^logout_user/', user_view.logout_user, name= 'logout_user'),
    url(r'^get_projects/', project_view.get_projects, name= 'get_projects'),
    url(r'^get_single_project/(?P<project_id>[0-9])/$', project_view.get_single_project, name= 'get_single_project'),
    url(r'^create_project/', project_view.create_project, name= 'create_project'),
    url(r'^get_statuses/', status_view.get_statuses, name= 'get_statuses'),
    url(r'^upload_file/', uploadfile_view.upload_file, name= 'upload_file'),
    url(r'^get_untransformed_files/', uploadfile_view.get_untransformed_files, name= 'get_untransformed_files'),
    url(r'^transform_upload_file/', transformfile_view.transform_upload_file, name= 'transform_upload_file'),
]