from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from image_lucida_app.models import *
from image_lucida_app.forms import *
from django.core.urlresolvers import reverse
from django.core import serializers
import json
import cv2
import numpy as np
from skimage import filters, segmentation, io
from sklearn.cluster import KMeans
from skimage.measure import label, regionprops
from skimage.color import label2rgb, rgb2gray


def calculate_coordinates(img_rows, img_cols):
    top_left = [0,0]
    top_right = [0,img_cols-1]
    bottom_left = [img_rows-1,0]
    bottom_right = [img_rows-1, img_cols-1]
    coor_obj = coordinates_model.Coordinates.objects.get_or_create(
        top_left=json.dumps(top_left),
        top_right=json.dumps(top_right),
        bottom_left=json.dumps(bottom_left),
        bottom_right=json.dumps(bottom_right)
        )
    print(coor_obj)
    return coor_obj[0]

def order_points(pts):
    # initialzie a list of coordinates that will be ordered
    # such that the first entry in the list is the top-left,
    # the second entry is the top-right, the third is the
    # bottom-right, and the fourth is the bottom-left
    print(pts)
    rect = np.zeros((4, 2), dtype = "float32")
 
    # the top-left point will have the smallest sum, whereas
    # the bottom-right point will have the largest sum
    s = pts.sum(axis = 1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
 
    # now, compute the difference between the points, the
    # top-right point will have the smallest difference,
    # whereas the bottom-left will have the largest difference
    diff = np.diff(pts, axis = 1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
 
    # return the ordered coordinates
    print(rect)
    return rect

def four_point_transform(img, points):
    # obtain a consistent order of the points and unpack them
    # individually
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format
    image = io.imread(img)
    print(image.shape)
    pts = np.array(points, dtype = "float32")
    rect = order_points(pts)
    (tl, tr, br, bl) = rect
 
    # compute the width of the new image, which will be the
    # maximum distance between bottom-right and bottom-left
    # x-coordiates or the top-right and top-left x-coordinates
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    print(maxWidth);
    # compute the height of the new image, which will be the
    # maximum distance between the top-right and bottom-right
    # y-coordinates or the top-left and bottom-left y-coordinates
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    print(maxHeight); 
    # now that we have the dimensions of the new image, construct
    # the set of destination points to obtain a "birds eye view",
    # (i.e. top-down view) of the image, again specifying points
    # in the top-left, top-right, bottom-right, and bottom-left
    # order
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype = "float32")
    print(dst) 
    # compute the perspective transform matrix and then apply it
    M = cv2.getPerspectiveTransform(rect, dst)
    print(M)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    print(warped.shape)
    return warped

def centroid_histogram(clt):
    # grab the number of different clusters and create a histogram
    # based on the number of pixels assigned to each cluster
    numLabels = np.arange(0, len(np.unique(clt.labels_)) + 1)
    (hist, _) = np.histogram(clt.labels_, bins = numLabels)
 
    # normalize the histogram, such that it sums to one
    hist = hist.astype("float")
    hist /= hist.sum()
 
    # return the histogram
    return hist

def plot_colors(hist, centroids):
    # initialize the bar chart representing the relative frequency
    # of each of the colors
    bar = np.zeros((50, 300, 3), dtype = "uint8")
    startX = 0
 
    # loop over the percentage of each cluster and the color of
    # each cluster
    for (percent, color) in zip(hist, centroids):
        # plot the relative percentage of each cluster
        endX = startX + (percent * 300)
        cv2.rectangle(bar, (int(startX), 0), (int(endX), 50),
            color.astype("uint8").tolist(), -1)
        startX = endX
    
    # return the bar chart
    return bar

def crop_shapes(img, points, new_height, new_width):
    # original image
    # -1 loads as-is so if it will be 3 or 4 channel as the original
    image = io.imread(img)
    # mask defaulting to black for 3-channel and transparent for 4-channel
    # (of course replace corners with yours)
    mask = np.zeros(image.shape, dtype=np.uint8)
    height, width, channel = image.shape
    aspect_ratio_height = height / new_height
    aspect_ratio_width = width / new_width
    initial_corners = np.array(points, dtype=np.int32)
    new_array = []
    for array in initial_corners:
        for item in array:
            test_array = [item[0] * aspect_ratio_width, item[1]* aspect_ratio_height]
            new_array.append(test_array)
    print(new_array)
    roi_corners = np.array([new_array], dtype=np.int32)
    # fill the ROI so it doesn't get wiped out when the mask is applied
    channel_count = image.shape[2]  # i.e. 3 or 4 depending on your image
    ignore_mask_color = (255,)*channel_count
    cv2.fillPoly(mask, roi_corners, ignore_mask_color)
    # from Masterfool: use cv2.fillConvexPoly if you know it's convex

    # apply the mask
    masked_image = cv2.bitwise_and(image, mask)
    return masked_image
    # save the result
    # cv2.imwrite('image_masked.png', masked_image)

def segment_images(img):

    im = io.imread(img)
    image = rgb2gray(im)
    val = filters.threshold_otsu(image)
    mask = image < val
    clean_border = segmentation.clear_border(mask)
    labeled = label(clean_border)
    cropped_images = {}
    cropped_coords = {}
    pad = 20
    for region_index, region in enumerate(regionprops(labeled)):
        print(region_index)
        if region.area < 2000:
            continue
        minr, minc, maxr, maxc = region.bbox
        print("bounding box:", minr, minc, maxr, maxc)
        cropped_coords[region_index] = {(minr-pad, minc-pad),(minr-pad, maxc-pad),(maxr+pad, maxc+pad),(maxr+pad, minc+pad) }
        cropped_images[region_index] = image[minr-pad:maxr+pad, minc-pad:maxc+pad]
    print(cropped_coords)
    return cropped_coords, cropped_images



