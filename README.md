User interface to create correspondences between camera and world points.

Usage
===========

The first step is to generate the point-correspondences. This is done by opening the file `index.html` in a recent web browswer. The camera image must be found in the current directory. An example is provided.
The camera image is loaded side by side with google map. The user must then click on both images and so that points A, B, C, D ... represent the same geographical place. 

AT LEAST FOUR POINTS MUST BE GIVEN.

To compute the homography, simply type:

~ $ python homography.py 

More info is available with the command:

~ $ python homography.py -h 

To validate the quality of the homography: 

~ $ python homography-validation.py 

Python Dependencies:
===================
 - opencv 2.4.11
 - numpy, matplotlib
 - utm 
 - argparse

Development:
===========

Installation of npm modules:

~$ npm install

Dev Server: 

~$ npm run dev

The web page will be available at http://localhost:8080.

To generate the javascript bundle:

~$ npm run build

Grateful Thanks to : 
====================
Eric Mcsween
Nicolas Saunier

