import json
import cv2
import numpy as np
from skimage import filters, segmentation, io, img_as_ubyte
from skimage.measure import label, regionprops
from skimage.color import rgb2gray
from image_lucida_app.models import coordinates_model

def calculate_coordinates(img_rows, img_cols):
    top_left = [0,0]
    top_right = [0,img_cols-1]
    bottom_left = [img_rows-1,0]
    bottom_right = [img_rows-1, img_cols-1]
    try:
        coor_obj = coordinates_model.Coordinates.objects.filter(
            top_left=json.dumps(top_left),
            top_right=json.dumps(top_right),
            bottom_left=json.dumps(bottom_left),
            bottom_right=json.dumps(bottom_right)
            )[0]
    except IndexError:
        coor_obj = coordinates_model.Coordinates.objects.create(
            top_left=json.dumps(top_left),
            top_right=json.dumps(top_right),
            bottom_left=json.dumps(bottom_left),
            bottom_right=json.dumps(bottom_right)
            )
    return coor_obj

def order_points(pts):
    # initialzie a list of coordinates that will be ordered
    # such that the first entry in the list is the top-left,
    # the second entry is the top-right, the third is the
    # bottom-right, and the fourth is the bottom-left
    rect = np.zeros((4, 2), dtype="float32")

    # the top-left point will have the smallest sum, whereas
    # the bottom-right point will have the largest sum
    sum_points = pts.sum(axis=1)
    rect[0] = pts[np.argmin(sum_points)]
    rect[2] = pts[np.argmax(sum_points)]

    # now, compute the difference between the points, the
    # top-right point will have the smallest difference,
    # whereas the bottom-left will have the largest difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    # return the ordered coordinates
    return rect

def four_point_transform(image, points):
    # obtain a consistent order of the points and unpack them
    # individually
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format
    # image = io.imread(img)
    # print(image.shape)
    pts = np.array(points, dtype="float32")
    rect = order_points(pts)
    (t_l, t_r, b_r, b_l) = rect

    # compute the width of the new image, which will be the
    # maximum distance between bottom-right and bottom-left
    # x-coordiates or the top-right and top-left x-coordinates
    width_a = np.sqrt(((b_r[0] - b_l[0]) ** 2) + ((b_r[1] - b_l[1]) ** 2))
    width_b = np.sqrt(((t_r[0] - t_l[0]) ** 2) + ((t_r[1] - t_l[1]) ** 2))
    max_width = max(int(width_a), int(width_b))
    # compute the height of the new image, which will be the
    # maximum distance between the top-right and bottom-right
    # y-coordinates or the top-left and bottom-left y-coordinates
    height_a = np.sqrt(((t_r[0] - b_r[0]) ** 2) + ((t_r[1] - b_r[1]) ** 2))
    height_b = np.sqrt(((t_l[0] - b_l[0]) ** 2) + ((t_l[1] - b_l[1]) ** 2))
    max_height = max(int(height_a), int(height_b))
    # now that we have the dimensions of the new image, construct
    # the set of destination points to obtain a "birds eye view",
    # (i.e. top-down view) of the image, again specifying points
    # in the top-left, top-right, bottom-right, and bottom-left
    # order
    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1]], dtype="float32")
    # compute the perspective transform matrix and then apply it
    transform = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, transform, (max_width, max_height))
    return warped

def crop_shapes(img, points, new_height, new_width):
    image = io.imread(img)
    mask = np.zeros(image.shape, dtype=np.uint8)
    height, width, channel = image.shape
    aspect_ratio_height = height / new_height
    aspect_ratio_width = width / new_width
    initial_corners = np.array(points, dtype=np.int32)
    new_array = []
    for array in initial_corners:
        array_length = len(array)
        for item in array:
            test_array = [item[0] * aspect_ratio_width, item[1]* aspect_ratio_height]
            new_array.append(test_array)
    if array_length == 4:
        final_image = four_point_transform(image, new_array)
    else:
        roi_corners = np.array([new_array], dtype=np.int32)
        channel_count = image.shape[2]
        ignore_mask_color = (255,)*channel_count
        cv2.fillPoly(mask, roi_corners, ignore_mask_color)
        final_image = cv2.bitwise_and(image, mask)
    return final_image

def segment_images(img):
    i_m = io.imread(img)
    image = rgb2gray(i_m)
    val = filters.threshold_otsu(image)
    mask = image < val
    clean_border = segmentation.clear_border(mask)
    labeled = label(clean_border)
    cropped_images = {}
    cropped_coords = {}
    pad = 60
    for region_index, region in enumerate(regionprops(labeled)):
        if region.area < 2000:
            continue
        minr, minc, maxr, maxc = region.bbox
        cropped_coords[region_index] = {(minr-pad, minc-pad),(minr-pad, maxc-pad),(maxr+pad, maxc+pad),(maxr+pad, minc+pad) }
        cropped_images[region_index] = i_m[minr-pad:maxr+pad, minc-pad:maxc+pad]
    return cropped_coords, cropped_images

def find_contours(img, dilation):
    i_m = io.imread(img)
    image = rgb2gray(i_m)
    cv_image = img_as_ubyte(i_m)
    grey_image = img_as_ubyte(image)
    _, thresh = cv2.threshold(grey_image, 150, 255,
                              cv2.THRESH_BINARY_INV)  # threshold
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    dilated = cv2.dilate(thresh, kernel, iterations=dilation)  # dilate
    _, contours, _ = cv2.findContours(
        dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)  # get contours
    contours_obj = {}
    for index, contour in enumerate(contours):
        # get rectangle bounding contour
        [x, y, w, h] = cv2.boundingRect(contour)
        im_h, im_w, _ = cv_image.shape
        
        # discard areas that are too large if height is within a range of ten pixels h >= im_h - 10
        im_h = im_h - 100
        im_w = im_w - 100
        if h >= im_h  and w >=im_w:
            continue

        # discard areas that are too small
        if h < 50 or w < 50:
            continue

        contours_obj[index] = {'coords': {'x': x, 'y': y, 'w': w, 'h': h}, 'bounding_box': {
            'top_left': (x, y), 'top_right': (x+w, y), 'bottom_right': (x+w, y+h), 'bottom_left': (x, y+h)}, 'height': im_h, 'width': im_w}
    return contours_obj
