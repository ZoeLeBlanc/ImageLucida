from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestProject(TestCase):
    """
    This class tests everything related to an order.

    Method List
    test_user_can_view_all_projects
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

    def test_user_can_create_a_project(self):
        """This methods test that a user can create a project"""
        self.assertEqual(project_model.Project.objects.get(user=self.test_user).pk, self.test_project.pk)

    def test_project_view(self):
        """
        Test that a customer can view on projects
        """
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, 200)

    def test_user_can_view_all_projects(self):
        response = self.client.get(reverse('image_lucida_app:projects'))
        response_context = response.context['projects']
        all_projects = project_model.Project.objects.all()
        self.assertEqual(len(response_context), len(all_projects))

    def test_user_can_view_project_details(self):
        response = self.client.get(reverse('image_lucida_app:project_detail', args={self.test_project.pk}))
        self.assertEqual(response.context['project'].pk, self.test_project.pk)


