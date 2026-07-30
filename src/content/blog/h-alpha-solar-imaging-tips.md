---
title: "H-Alpha Solar Image Processing Method"
description: "A step-by-step Photoshop workflow for combining color channels from an H-alpha filtered solar image into a final processed result."
legacy: true
legacyCategory: "Astrophotography"
draft: false
---

Here's a simple processing method for solar images taken with a Hydrogen Alpha filter, but some of these same principles can also be used to shoot the sun in white light as well. Always use proper filters and techniques when pointing your eyes and scopes at the sun...for your safely.

The equipment used for the original shot was a Televue TV-102 refractor on a Losmandy GM-8 mount with a Canon Digital Rebel camera. The filter was a Coronado AS-1 90mm H-Alpha filter. All equipment, except for the Rebel, was provided by the Three Rivers Foundation (TM).

Below is the original shot, given a basic stretch of the histogram on each color channel so that you can actually see the sun itself:

<!-- image not migrated: "originalsolardisk.jpg" - original solar disk shot with basic histogram stretch on each color channel -->

As you can tell, the surface features are quite abundant, though there isn't much prominence detail visible. Of course, just because it isn't visible doesn't mean that it isn't there! We just have to know how to pull it out while maintaining, even improving, the surface details.

Looking at the color component images below, you can see that the blue frame is pretty much a waste. Keeping it in the final image simply adds noise that is not needed. So, we'll be dumping it.

<!-- image not migrated: "tricolorsolar.jpg" - red, green, and blue channel component images of the solar disk shown side by side -->

The green image shows the best surface detail. We'll be using this for the solar disk itself.

The red image is purposely brightened (gamma increase) so that the prominences come out. So, there is indeed prominences in the image, but bringing up the gamma also brings up that nasty ghost image in the upper right corner. This ghosting, I am told, is caused by the H-Alpha filter needing a bit finer tuning. Regardless, it will be mechanically erased later in the process.

So, I have the red channel and the green channel to work with...which is enough.

To split the color channels in Photoshop, simply select the "Channels" palette in the lower right corner. On the Channels palette there is an arrow in the upper right corner which is a dropdown menu. From this menu, choose "Split Channels." This gives you three individual grayscale images, one representing the details of each color channel.

From here, do some Levels and Curves to bring out the detail in each channel. In most cases, the blue will be discarded. On the green, you want to bring out the surface detail. On the red, you want to boost the gamma or give a good non-linear stretch in Curves so that the Prominence detail shows.

Then, save both the red and green channels as individual images.

Open copies of each red and green channel image into Photoshop once again. Select the Green image and click on the black background using the Magic Wand tool. You might have to adjust the "tolerance" setting a bit, but make sure that the tool selects everything EXCEPT the solar disk.

Once you've done this, invert the selection so that the disk itself is selected. Using the "Feather" function, select a small feather between 5 and 10 pixels or so. Then Copy the selected area. Now, in the red channel image, select Paste. This will apply the solar disk to the red channel image. At this point, you may want to select "Free Transform" on the new layer so that you can enlarge the solar disk slightly. This way, you can bring the edges of the solar disk right up to the prominences themselves. Some people leave the halo in the final image, though I prefer to reduce it quite a bit...it's just a matter of personal taste.

Once you've got the disk centered over the prominence layer, make certain that each layer looks the way you want it. If not, some final Levels and Curves on each layer would be a good thing to do at this point. Once you've done this, "flatten" the image to make one layer. Save the result.

On a copy of the flattened image, convert it to RGB from grayscale. At this time, you might want to get rid of the ghosting in the background. I find that the "Clone" tool works wonders here. Take care not to erase any of the prominence detail.

Then, choose the Levels dialog and drag the gamma slider of the blue channel all the way to the right. On the green channel, slide it half way to the right. This should give you a orangish, yellow hue, something that you can work with by refining the Levels adjustments or by working with the Color Balance dialog.

If you've done it correctly, you should get something like this as a final image:

<!-- image not migrated: "Solar19June20041000.jpg" - final processed H-alpha solar disk image -->

It takes some practice, but this processing procedure is really quite simple. The end result depends much on personal taste. The hard part of the image is acquiring it in the first place. Focusing the camera on the solar disk is difficult through the H-Alpha filter. Then, finding the appropriate exposure length is quite difficult as well. The example above was taken at the prime focus of an f/8.6 scope with a 1/250 shutter speed at ISO 100. Just bracket the exposures and take the best shots.

By the way, it's okay to take your Red channel from a separate image. In fact it might be wise to do it this way. More than likely, an overexposed image will be the best candidate to provide your prominence details.
