from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from django.contrib.auth.models import User


class TestCoordinates(TestCase):
    """
    This class tests everything related to saving coordinates.

    Method List
    test_user_can_create_coordinates
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
        self.test_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="4,2",
            left_top="-5,2",
            left_bottom="-5,-2",
            right_bottom="-4,-2"
            )

    def test_user_can_create_coordinates(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(coordinates_model.Coordinates.objects.get(id=self.test_coordinates).pk, self.test_coordinates.pk)

   