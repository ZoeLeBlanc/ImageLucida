from django.conf.urls import url, include
from django.contrib import admin
from image_lucida_app.views import *



app_name = 'image_lucida_app'
urlpatterns = [
    # index and user urls
    url(r'^$', index_view.index, name='index'),
    url(r'^auth_user/', user_view.auth_user, name='auth_user'),
    url(r'^register_user/', user_view.register_user, name='register_user'),
    url(r'^login_user/', user_view.login_user, name='login_user'),
    url(r'^logout_user/', user_view.logout_user, name= 'logout_user'),
    # project urls
    url(r'^get_projects/', project_view.get_projects, name= 'get_projects'),
    url(r'^get_single_project/(?P<project_id>[0-9])/$', project_view.get_single_project, name= 'get_single_project'),
    url(r'^cu_project/', project_view.cu_project, name= 'cu_project'),
    url(r'^delete_project/', project_view.delete_project, name= 'delete_project'),
    url(r'^duplicate_project/(?P<project_id>[0-9])/$', project_view.duplicate_project, name= 'duplicate_project'),
    # folder urls
    url(r'^get_single_folder/(?P<folder_id>[0-9])/$', folder_view.get_single_folder, name= 'get_single_folder'),
    url(r'^get_folders/(?P<project_id>[0-9])/$', folder_view.get_folders, name= 'get_folders'),
    url(r'^cu_folder/', folder_view.cu_folder, name= 'cu_folder'),
    url(r'^delete_folder/', folder_view.delete_folder, name= 'delete_folder'),
    url(r'^duplicate_folder/(?P<folder_id>[0-9])/$', folder_view.duplicate_folder, name= 'duplicate_folder'),
    # bucket urls
    url(r'^get_buckets/(?P<folder_id>[0-9])/$', bucket_view.get_buckets, name= 'get_buckets'),
    url(r'^get_single_bucket/(?P<bucket_id>[0-9])/$', bucket_view.get_single_bucket, name= 'get_single_bucket'),
    url(r'^cu_bucket/', bucket_view.cu_bucket, name= 'cu_bucket'),
    url(r'^delete_bucket/', bucket_view.delete_bucket, name= 'delete_bucket'),
    # upload file urls
    url(r'^upload_file/', uploadfile_view.upload_file, name= 'upload_file'),
    url(r'^get_upload_files/', uploadfile_view.get_upload_files, name= 'get_upload_files'),
    url(r'^delete_uploaded_file/', uploadfile_view.delete_uploaded_file, name= 'delete_uploaded_file'),
    url(r'^duplicate_upload_file/', uploadfile_view.duplicate_upload_file, name= 'duplicate_upload_file'),
    # file urls
    url(r'^create_file/', file_view.create_file, name= 'create_file'),
    url(r'^get_single_file/(?P<file_id>\d+)/$', file_view.get_single_file, name= 'get_single_file'),
    url(r'^get_source_files/(?P<source_id>\d+)/$', file_view.get_source_files, name= 'get_source_files'),
    url(r'^get_group_files/(?P<group_id>\d+)/$', file_view.get_group_files, name= 'get_group_files'),
    url(r'^delete_file/', file_view.delete_file, name= 'delete_file'),
    url(r'^update_file/', file_view.update_file, name= 'update_file'),
    url(r'^tag_file/', file_view.tag_file, name= 'tag_file'),
    url(r'^remove_tag_file/', file_view.remove_tag_file, name= 'remove_tag_file'),
    # source urls
    url(r'^get_sources/(?P<bucket_id>[0-9])/$', source_view.get_sources, name= 'get_sources'),
    url(r'^get_single_source/(?P<source_id>[0-9])/$', source_view.get_single_source, name= 'get_single_source'),
    url(r'^cu_source/', source_view.cu_source, name= 'cu_source'),
    url(r'^delete_source/', source_view.delete_source, name= 'delete_source'),
    # group urls
    url(r'^get_groups/(?P<source_id>[0-9])', group_view.get_groups, name= 'get_groups'),
    url(r'^get_single_group/(?P<group_id>[0-9])/$', group_view.get_single_group, name= 'get_single_source'),
    url(r'^update_group/', group_view.update_group, name= 'update_group'),
    url(r'^create_group/', group_view.create_group, name= 'create_group'),
    url(r'^delete_group/', group_view.delete_group, name= 'delete_group'),
    # text file urls
    url(r'^process_text/', textfile_view.process_text, name= 'process_text'),
    url(r'^get_single_text_file/(?P<text_file_id>\d+)/$', textfile_view.get_single_text_file, name= 'get_single_text_file'),
    url(r'^update_text_file/', textfile_view.update_text_file, name= 'update_text_file'),
    url(r'^delete_text_file/', textfile_view.delete_text_file, name= 'delete_text_file'),
    # image file urls
    url(r'^tag_images/', imagefile_view.tag_images, name='tag_images'),
    url(r'^image_process_text/', imagefile_view.image_process_text, name='image_process_text'),
    url(r'^auto_segment_image_file/', imagefile_view.auto_segment_image_file, name='auto_segment_image_file'),
    url(r'^delete_image_file/', imagefile_view.delete_image_file, name= 'delete_image_file'),
    url(r'^manual_segmentation/', imagefile_view.manual_segmentation, name= 'manual_segmentation'),
    url(r'^get_single_image_file/(?P<image_file_id>\d+)/$', imagefile_view.get_single_image_file, name= 'get_single_image_file'),
]
