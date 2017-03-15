from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from image_lucida_app.media import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestTag(TestCase):
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
        self.client.login(
            uesrname=self.test_user.username,
            password=self.test_user.password
            )
        self.test_tag = tag_model.Tag.objects.create(
            user=self.test_user,
            tag_name="Cairo"
            )

    def test_user_can_create_a_tag(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(tag_model.Tag.objects.get(user=self.test_user).pk, self.test_tag.pk)

    def test_tag_view(self):
        """
        Test that a user can transform a file 
        """
        response = self.client.get(reverse('image_lucida_app:tag-detail', args={self.test_tag.pk}))
        self.assertEqual(response.status_code, 200)

    

