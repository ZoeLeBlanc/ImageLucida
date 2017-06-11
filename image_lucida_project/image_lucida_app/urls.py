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
    url(r'^tag_project/', project_view.tag_project, name= 'tag_project'),
    url(r'^delete_project/', project_view.delete_project, name= 'delete_project'),
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
    url(r'^delete_uploaded_file/', uploadfile_view.delete_uploaded_file, name= 'delete_uploaded_file'),
    url(r'^duplicate_untransformed_file/', uploadfile_view.duplicate_untransformed_file, name= 'duplicate_untransformed_file'),
    # transform file urls
    url(r'^transform_upload_file/', transformfile_view.transform_upload_file, name= 'transform_upload_file'),
    url(r'^assign_transform_file/', transformfile_view.assign_transform_file, name= 'assign_transform_file'),
    url(r'^unassign_transform_file/', transformfile_view.unassign_transform_file, name= 'unassign_transform_file'),
    url(r'^get_single_transform_file/(?P<transform_file_id>\d+)/$', transformfile_view.get_single_transform_file, name= 'get_single_transform_file'),
    url(r'^add_archival_source/', transformfile_view.add_archival_source, name= 'add_archival_source'),
    url(r'^add_issue/', transformfile_view.add_issue, name= 'add_issue'),
    url(r'^delete_transform_file/', transformfile_view.delete_transform_file, name= 'delete_transform_file'),
    url(r'^duplicate_transform_file/', transformfile_view.duplicate_transform_file, name= 'duplicate_transform_file'),
    url(r'^update_transform_file/', transformfile_view.update_transform_file, name= 'update_transform_file'),
    url(r'^untransform_file/', transformfile_view.untransform_file, name= 'untransform_file'),
    url(r'^get_transform_files/', transformfile_view.get_transform_files, name= 'get_transform_files'),
    url(r'^tag_transform_file/', transformfile_view.tag_transform_file, name= 'tag_transform_file'),
    # archival source urls
    url(r'^get_all_archival_sources/', archivalsource_view.get_all_archival_sources, name= 'get_all_archival_sources'),
    url(r'^get_file_archival_sources/(?P<transform_file_id>\d+)/$', archivalsource_view.get_file_archival_sources, name= 'get_file_archival_sources'),
    url(r'^create_archival_source/', archivalsource_view.create_archival_source, name= 'create_archival_source'),
    url(r'^delete_archival_source/', archivalsource_view.delete_archival_source, name= 'delete_archival_source'),
    url(r'^update_archival_source/', archivalsource_view.update_archival_source, name= 'update_archival_source'),
    # issues urls
    url(r'^get_all_issues/', issue_view.get_all_issues, name= 'get_all_issues'),
    url(r'^get_file_issues/(?P<transform_file_id>\d+)/$', issue_view.get_file_issues, name= 'get_file_issues'),
    url(r'^update_issue/', issue_view.update_issue, name= 'update_issue'),
    url(r'^create_issue/', issue_view.create_issue, name= 'create_issue'),
    url(r'^delete_issue/', issue_view.delete_issue, name= 'delete_issue'),
    # text annotation urls
    url(r'^process_text/', textannotation_view.process_text, name= 'process_text'),
    url(r'^get_text_anno_and_file/(?P<text_anno_id>\d+)/$', textannotation_view.get_text_anno_and_file, name= 'get_text_anno_and_file'),
    url(r'^update_text_annotation/', textannotation_view.update_text_annotation, name= 'update_text_annotation'),
    url(r'^tag_text_annotation/', textannotation_view.tag_text_annotation, name= 'tag_text_annotation'),
    url(r'^delete_text_annotation/', textannotation_view.delete_text_annotation, name= 'delete_text_annotation'),
    url(r'^get_text_annotations/(?P<transform_file_id>\d+)/$', textannotation_view.get_text_annotations, name = 'get_text_annotations'),
    # image annotation urls
    url(r'^transform_image_annotations/', imageannotation_view.transform_image_annotations, name= 'transform_image_annotations'),
    url(r'^process_image_annotations/', imageannotation_view.process_image_annotations, name= 'process_image_annotations'),
    url(r'^auto_segment_image_annotation/', imageannotation_view.auto_segment_image_annotation, name='auto_segment_image_annotation'),
    url(r'^tag_image_annotation/', imageannotation_view.tag_image_annotation, name= 'tag_image_annotation'),
    url(r'^delete_image_annotation/', imageannotation_view.delete_image_annotation, name= 'delete_image_annotation'),
    url(r'^manual_segmentation/', imageannotation_view.manual_segmentation, name= 'manual_segmentation'),
    url(r'^get_image_annotations/(?P<transform_file_id>\d+)/$', imageannotation_view.get_image_annotations, name= 'get_image_annotations'),
]