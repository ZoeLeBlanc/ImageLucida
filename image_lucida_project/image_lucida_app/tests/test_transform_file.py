from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from image_lucida_app.media import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestTransformFile(TestCase):
    """
    This class tests everything related to transforming a file.

    Method List
    test_user_can_create_an_upload_file
    test_user_can_create_a_project
    Arguments unittest.TestCase allows the unittest model to know what to test.
    Author Zoe LeBlanc,
    """
    def setUp(self):
        '''This method sets up initial instances of User from the database'''
        self.test_user = User.objects.create_user(
            username="zoe",
            first_name="Zoe",
            last_name="LeBlanc",
            email="z@z.com",
            password="asdf1234"
            )
        self.test_project = project_model.Project.objects.create(
            user=self.test_user,
            name="Test",
            description="a test project",
            )
        self.client.login(
            uesrname=self.test_user.username,
            password=self.test_user.password
            )
        self.test_upload_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="4,2",
            left_top="-5,2",
            left_bottom="-5,-2",
            right_bottom="-4,-2"
            )
        self.test_upload_file = uploadfile_model.Upload_File.objects.create(
                name="test_pic",
                user=self.test_user,
                upload_file="/media/test_pic.jpg",
                upload_file_coordinates=self.test_upload_coordinates
            )
        self.test_transform_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="2,2",
            left_top="-2,2",
            left_bottom="-2,-2",
            right_bottom="-2,-2"
            )
        self.test_transform_file = 
            transformfile_model.Transform_File.objects.create(
                transform_file_name="test_pic",
                upload_file=self.test_upload_file,
                transform_file="/media/test_pic.jpg",
                page_number=1,
            )
        self.test_issue = issue_model.Issue.objects.create(
            user=self.test_user,
            issue_name="The Arab Observer",
            date_published="December 1960",
            publication_location="Cairo, Egypt",
            )
        self.test_archival_source = archivalsource_model.Archival_Source.objects.create(
            user=self.test_user,
            archive_name="Library of Congress"
            )

    def test_user_can_create_a_transform_file(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(transformfile_model.Transform_File.objects.get(upload_file=self.test_upload_file).pk, self.test_transform_file.pk)

    def test_transform_file_view(self):
        """
        Test that a user can transform a file 
        """
        response = self.client.get(reverse('image_lucida_app:transform-file', args={self.test_transform_file.pk}))
        self.assertEqual(response.status_code, 200)

    def test_user_can_add_issue(self):
        """Test user can add an issue to a transform file"""
        response = self.client.get(reverse('image_lucida_app:add-issue', args={self.test_issue.pk}))
        self.assertEqual(response.status_code, 200)


    def test_user_can_add_archival_source(self):
        """Test user can add archival source to transform file"""
        response = self.client.get(reverse('image_lucida_app:add-archival-source', args={self.test_archival_source.pk}))
        self.assertEqual(response.status_code, 200)

    def test_user_can_add_transform_coordinates(self):
        """Test user can add archival source to transform file"""
        response = self.client.get(reverse('image_lucida_app:add-transform-file-coordinates', args={self.test_transform_coordinates.pk}))
        self.assertEqual(response.status_code, 200)
