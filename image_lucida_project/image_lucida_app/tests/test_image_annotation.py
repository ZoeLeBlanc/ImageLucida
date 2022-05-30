from django.test import TestCase
from django.urls import reverse
from image_lucida_app.models import *
from image_lucida_app.media import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TestImageAnnotation(TestCase):
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
        self.test_upload_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="104,102",
            left_top="-105,102",
            left_bottom="-105,-102",
            right_bottom="-104,-102"
            )
        self.test_upload_file = uploadfile_model.Upload_File.objects.create(
                name="test_pic",
                user=self.test_user,
                upload_file="/media/test_pic.jpg",
                upload_file_coordinates=self.test_upload_coordinates
            )
        self.test_transform_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="82,82",
            left_top="-82,82",
            left_bottom="-82,-82",
            right_bottom="-82,-82"
            )
        self.test_transform_file = 
            transformfile_model.Transform_File.objects.create(
                transform_file_name="test_pic",
                upload_file=self.test_upload_file,
                transform_file="/media/test_pic.jpg",
                page_number=1,
                transform_file_coordinates=self.test_transform_coordinates
            )
        self.test_image_annotation_coordinates = coordiantes_model.Coordinates.objects.create(
            right_top="12,12",
            left_top="-12,12",
            left_bottom="-12,-12",
            right_bottom="-12,-12"
            )
        self.test_image_annotation = imageannotation_model.Image_Annotation.objects.create(
            transform_file=self.test_transform_file,
            cover=True,
            cover_story=True,
            )
        self.test_tag = tag_model.Tag.objects.create(
            user=self.test_user,
            tag_name="Cairo"
            )
    def test_user_can_create_an_image_annotation(self):
        """This methods test that a user can create an upload file"""
        self.assertEqual(imageannotation_model.Image_Annotation.objects.get(id=self.test_image_annotation.pk).pk, self.test_image_annotation.pk)

    def test_image_annotation_view(self):
        """
        Test that a user can transform a file 
        """
        response = self.client.get(reverse('image_lucida_app:iamge-annotation-detail', args={self.test_image_annotation.pk}))
        self.assertEqual(response.status_code, 200)

    def test_user_can_tag_to_image_annotation(self):
        """Test user can add an issue to a transform file"""
        response = self.client.get(reverse('image_lucida_app:add-tag-annotation', args={self.test_tag.pk}))
        self.assertEqual(response.status_code, 200)


    def test_user_can_add_image_annotation_coordinates(self):
        """Test user can add archival source to transform file"""
        response = self.client.get(reverse('image_lucida_app:add-image-annotation-coordinates', args={self.test_image_annotation_coordinates.pk}))
        self.assertEqual(response.status_code, 200)
