from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from image_lucida_app.media import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestUploadFile(TestCase):
    """
    This class tests everything related to an order.

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
        self.test_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="4,2",
            left_top="-5,2",
            left_bottom="-5,-2",
            right_bottom="-4,-2"
            )
        self.test_upload_file = uploadfile_model.Upload_File.objects.create(
                name="test_pic",
                user=self.test_user,
                upload_file="/media/test_pic.jpg",
            )
    def test_user_can_create_an_upload_file(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(uploadfile_model.Upload_File.objects.get(user=self.test_user).pk, self.test_upload_file.pk)

    def test_upload_file_view(self):
        """
        Test that a user can upload a file 
        """
        response = self.client.get(reverse('image_lucida_app:add-new-file', args={self.test_upload_file.pk}), follow=True)
        self.assertEqual(response.status_code, 200)

    def test_user_can_view_uploaded_file(self):
        """Test that a user gets redirected to the correct view and the view has their file rendered """
        response = self.client.get(reverse('image_lucida_app:add-new-file', args={self.test_upload_file.pk}))
        self.assertRedirects(response, '/transform-file/', status_code=301)

    
    def test_user_can_add_upload_coordinates(self):
        """Test user can add archival source to transform file"""
        response = self.client.get(reverse('image_lucida_app:add-upload-file-coordinates', args={self.test_coordinates.pk}))
        self.assertEqual(response.status_code, 200)

