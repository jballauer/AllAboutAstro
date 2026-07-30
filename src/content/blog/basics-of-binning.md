---
title: "The Basics of Binning"
description: "An explanation of CCD pixel binning, how it trades sampling rate for sensitivity, and how to match binning choices to a scope's focal length and local seeing conditions."
legacy: true
legacyCategory: "Astrophotography"
draft: false
---

Just think of binning as a way to increase the size of the pixels in an image. This gives greater sensitivity at the expense of "sampling rate."

For example, my Tak FSQ-106, when used in conjunction with my SBIG ST-7 gives a sampling size of 3.5 arc-seconds per pixel when "unbinned (1x1)". This means that each 9 micron pixel will image an area of the sky 3.5 arc-seconds wide. If I were to bin the chip 2x2, that would give me an effective pixel size of 18 microns at 7 arc-seconds per pixel.

Now, if my seeing allows for details less than 7 arc-seconds per pixel, then I can benefit from using the CCD camera unbinned. That is because this setup will allow for details less than 7 arc-seconds to be captured on the chip. If I bin 2x2, then I am "undersampling" the image - not capturing all the detail that the system provides.

Under my skies, I can ALWAYS get under 7 arc-seconds and can quite often get under 3.5 arc-seconds. This means that I always use my ST-7 unbinned with my Tak 106 in order to capture the most detail. The exception is when I use an luminance frame at 1x1, then I can afford to get the color information at 2x2, thus undersampling the color information for the sake of speed. Otherwise, if I use this camera binned 2x2 with my Tak, then I am always undersampling the image.

The decision to bin or not bin is more diffiicult when the CCD camera is better matched to the scope. For example, using the ST-7 camera with my 10" LX200, I get .75 arc-seconds per pixel when used unbinned. This happens to be a perfect resolution for planetary imaging since it accounts for the best seeing that I can possibly achieve with this setup. However, 2x2 binning would give a fine 1.5 arc-seconds per pixel, which my seeing doesn't accommodate all that often. Therefore, on most nights, using the ST-7 unbinned would be "over-sampling" the image. In other words, I would have gotten the same amount of detail in my image if I had binned 2x2, and I would have gotten a 4 time speed increase as a result.

To find the sampling rate of a scope and CCD camera, try this CCD calculator at:

http://www.newastro.com/wodaski/pick_a_camera.htm

It's important to match the CCD camera to the scope to give you the best options available. In other words, the ST-10 doesn't make a great match for longer focal length scopes simply because you can seldom take advantage of the small pixels sizes (6.8 microns) when used unbinned. That's why cameras like the ST-9 exist (with 21 micron pixels). They are designed to be used with longer focal length scopes to give maximum field of view under most conditions. Seldom would such a camera benefit from having pixel sizes less than 21 microns will certain scopes...like those over 3000mm focal lengths or so.
