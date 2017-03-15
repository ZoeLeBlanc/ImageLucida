from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from django.contrib.auth.models import User


class TestArchivalSource(TestCase):
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
        self.test_archival_source = archivalsource_model.Archival_Source.objects.create(
            user=self.test_user,
            archive_name="Library of Congress"
            )

    def test_user_can_create_an_archival_source(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(archivalsource_model.Archival_Source.objects.get(user=self.test_user).pk, self.test_archival_source.pk)

    def test_archival_source_view(self):
        """
        Test that a user can transform a file 
        """
        response = self.client.get(reverse('image_lucida_app:archival-source-detail', args={self.test_archival_source.pk}))
        self.assertEqual(response.status_code, 200)

    

