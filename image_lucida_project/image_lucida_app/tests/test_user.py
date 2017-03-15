from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestUser(TestCase):
    """
    This class tests everything related to an order.

    Method List
    test_can_create_a_user
    test_user_can_be_authenticated
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


    def test_can_create_a_user(self):
        """This methods test that a user is created"""
        self.assertEqual(User.objects.get(username=test_user.username).pk, test_user.pk)

    def test_user_can_login(self):
        auth_user = authenticate(
            username= self.test_user.username,
            password=self.test_user.password
            )
        print(auth_user)
        self.assertIsNotNone(auth_user)
        response = self.client.get(reverse('bangazon_ultra:login'))
        self.assertEqual(response.status_code, 200)

