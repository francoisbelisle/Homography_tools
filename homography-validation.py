#! /usr/bin/env python
# -*- coding: utf-8 -*-

# This script validates graphically the homography.py functions

# Dependencies : 
# - opencv 2.4.11
# - numpy, matplotlib
# - utm 
# - argparse

# belisle.francois@gmail.com
# 20150917


def project(points, homography):
    """
    Expected format for n points : 2Xn

    """
    if points.shape[0] != 2:
        raise Exception('array points of dimension {0} {1}'. \
                        format(points.shape[0], points.shape[1]))

    if (homography is not None) and homography.size > 0:
        import numpy as np
        augmentedPoints = np.append(points,[[1]*points.shape[1]], 0)
        proj_pts = np.dot(homography, augmentedPoints)
        proj_cart = proj_pts[0:2]/proj_pts[2]
        return proj_cart

    return points

def homography_error(pc_filename):

    from homography import create_point_correspondences, homography_matrix

    world, image = create_point_correspondences(pc_filename)
    homography = homography_matrix(pc_filename)
    
    import numpy as np
    inv_homography = np.linalg.inv(homography)

    img_pts_proj = project(image.T, homography)
    img_pts_reprojected = project(img_pts_proj, inv_homography)

    error = 0
    
    for i in range(img_pts_proj.shape[1]):
        
        pt = image[i]
        reproj = img_pts_reprojected.T[i]
        error += np.linalg.norm(reproj-pt)

    return error

def projection_error_matrix(pc_filename, frame):

    from homography import homography_matrix
    homography = homography_matrix(pc_filename)
    
    import numpy as np
    inv_homography = np.linalg.inv(homography)

    import cv2
    video_image = cv2.imread(frame_filename)

    rows,columns,_ = video_image.shape
    error_m = np.zeros((rows,columns))

    for row in range(rows):
        for col in range(columns):

            pt = np.array(([row], [col]))
            proj = project(pt, homography)
            reproj = project(proj, inv_homography)
            error = np.linalg.norm(reproj-pt)
            error_m[row][col] = error

    return error_m

def display_total_homography_error(pc_filename, frame_filename, interactive = False):
    
    print("The projection error for the file : " +
          pc_filename + " is ")
    
    error_m = projection_error_matrix(pc_filename, frame_filename)
    print(error_m)
    print("Total error : " + str(error_m.sum()))
    import numpy as np
    print("Max error : " + str(np.amax(error_m)))
    np.savetxt(pc_filename+'_error.txt', error_m)
    
    (rows,columns) = error_m.shape
    
    import matplotlib.cm as cm
    import matplotlib.pyplot as plt
    
    im = plt.imread(frame_filename)
    implot = plt.imshow(im, extent=[0,columns,0,rows], zorder=0)
    heatmap = plt.pcolor(error_m, cmap=cm.Reds, zorder=1, alpha=0.7)
    
    if interactive == False:
        plt.savefig(pc_filename+'_error.png')
    else:
        plt.show()

def display_homography_projection(pc_filename, frame_filename, interactive=True):

    from homography import create_point_correspondences, homography_matrix

    world, image = create_point_correspondences(pc_filename)
    homography = homography_matrix(pc_filename)
    
    import cv2
    video_image = cv2.imread(frame_filename)

    import numpy as np
    inv_homography = np.linalg.inv(homography)

    world_projected = project(world.T, inv_homography)
    img_pts_proj = project(image.T, homography)
    img_pts_reprojected = project(img_pts_proj, inv_homography)

    for i in range(img_pts_proj.shape[1]):
        
        image_coords = tuple(np.int32(np.round(image[i])))
        reproj_coords = tuple(np.int32(np.round(img_pts_reprojected.T[i])))
        world_proj_coords = tuple(np.int32(np.round(world_projected.T[i])))

        cv2.circle(video_image,image_coords,2,(255,0,0))
        cv2.circle(video_image,world_proj_coords,22,(0,0,255))
        cv2.circle(video_image,reproj_coords,22,(0,255,0))

    if interactive == True:
        cv2.imshow('video frame', video_image)
        cv2.waitKey()
        cv2.destroyAllWindows()
    else:
        cv2.imwrite('homography_projection.png', video_image)

if __name__ == '__main__':

    import argparse
    parser = argparse.ArgumentParser(description=
                                     "This scripts validates graphically a homography matrix.")
    parser.add_argument('-p', 
                        dest = 'pc_filename', 
                        help = 'name of the text file containing the points',
                        default = 'sample/point-correspondences.txt')

    parser.add_argument('-i', 
                        dest = 'frame_filename',
                        help = 'Image of a frame from the video', 
                        default = 'sample/capture.png')

    args = parser.parse_args()

    pc_filename = 'sample/point-correspondences.txt'
    frame_filename = 'sample/capture.png'

    from homography import homography_matrix
    homography = homography_matrix(pc_filename, save=False)

    display_homography_projection(pc_filename, frame_filename, interactive=True)
    display_total_homography_error(pc_filename, frame_filename, interactive=True)

    
        

    

