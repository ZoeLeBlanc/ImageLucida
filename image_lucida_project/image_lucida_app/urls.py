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
    url(r'^create_project/', project_view.create_project, name= 'create_project'),
    url(r'^update_project/', project_view.update_project, name= 'update_project'),
    url(r'^duplicate_project/(?P<project_id>[0-9])/$', project_view.duplicate_project, name= 'duplicate_project'),
    # folder urls
    url(r'^get_single_folder/(?P<folder_id>[0-9])/$', folder_view.get_single_folder, name= 'get_single_folder'),
    url(r'^create_folder/', folder_view.create_folder, name= 'create_folder'),
    url(r'^update_folder/', folder_view.update_folder, name= 'update_folder'),
    url(r'^delete_folder/', folder_view.delete_folder, name= 'delete_folder'),
    url(r'^duplicate_folder/(?P<folder_id>[0-9])/$', folder_view.duplicate_folder, name= 'duplicate_folder'),
    # status urls
    url(r'^get_statuses/', status_view.get_statuses, name= 'get_statuses'),
    # upload file urls
    url(r'^upload_file/', uploadfile_view.upload_file, name= 'upload_file'),
    url(r'^get_untransformed_files/', uploadfile_view.get_untransformed_files, name= 'get_untransformed_files'),
    url(r'^delete_untransformed_file/', uploadfile_view.delete_untransformed_file, name= 'delete_untransformed_file'),
    # transform file urls
    url(r'^transform_upload_file/', transformfile_view.transform_upload_file, name= 'transform_upload_file'),
    url(r'^assign_transform_file/', transformfile_view.assign_transform_file, name= 'assign_transform_file'),
    url(r'^get_single_transform_file/(?P<transform_file_id>\d+)/$', transformfile_view.get_single_transform_file, name= 'get_single_transform_file'),
    url(r'^add_archival_source/', transformfile_view.add_archival_source, name= 'add_archival_source'),
    url(r'^add_issue/', transformfile_view.add_issue, name= 'add_issue'),
    url(r'^delete_transform_file/', transformfile_view.delete_transform_file, name= 'delete_transform_file'),
    url(r'^update_transform_file/', transformfile_view.update_transform_file, name= 'update_transform_file'),
    url(r'^get_transform_files/', transformfile_view.get_transform_files, name= 'get_transform_files'),
    # archival source urls
    url(r'^get_archival_sources/', archivalsource_view.get_archival_sources, name= 'get_archival_sources'),
    url(r'^create_archival_source/', archivalsource_view.create_archival_source, name= 'create_archival_source'),
    # issues urls
    url(r'^get_issues/', issue_view.get_issues, name= 'get_issues'),
    url(r'^create_issue/', issue_view.create_issue, name= 'create_issue'),
    # text annotation urls
    url(r'^process_text/', textannotation_view.process_text, name= 'process_text'),
    url(r'^get_text_anno_and_file/(?P<text_anno_id>\d+)/$', textannotation_view.get_text_anno_and_file, name= 'get_text_anno_and_file'),
    url(r'^update_text_annotation/', textannotation_view.update_text_annotation, name= 'update_text_annotation'),
    url(r'^tag_text_annotation/', textannotation_view.tag_text_annotation, name= 'tag_text_annotation'),
    url(r'^segment_text/', textannotation_view.segment_text, name = 'segment_text'),
    # image annotation urls
    url(r'^transform_image_annotations/', imageannotation_view.transform_image_annotations, name= 'transform_image_annotations'),
    url(r'^process_image_annotations/', imageannotation_view.process_image_annotations, name= 'process_image_annotations'),
    url(r'^segment_image_annotation/', imageannotation_view.segment_image_annotation, name='segment_image_annotation'),
    url(r'^tag_image_annotation/', imageannotation_view.tag_image_annotation, name= 'tag_image_annotation'),
    url(r'^get_image_annotations/(?P<transform_file_id>\d+)/$', imageannotation_view.get_image_annotations, name= 'get_image_annotations'),
]