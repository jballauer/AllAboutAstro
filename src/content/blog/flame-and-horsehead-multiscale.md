---
title: The Flame and the Horsehead - A Multi-Scale Approach
description: Mixing data from two different telescopes and cameras into a single mosaic image.
pubDate: 2019-10-09
draft: false
---

The other day, a friend of mine asked a question about multi-scale (or hybrid) imaging. He was considering two scopes with similar cameras to be used simultaneously and he was curious about how optically close the scopes need to be in order to mix together the data. I stated that they didn't need to be all that similar and that I use mixed data all the time.

Here's an example, an image that I completed the other night. Clear-filtered luminance for this image was acquired in November, 2017. It is two frames, 120 minutes of the Flame Nebula and 170 minutes of the Horsehead using a 12.5" RCOS RC and FLI PL-16803 astro camera. This was preprocessed and stitched together in PixInsight.

The color information was shot two nights ago, 186 minutes using the Tak FSQ-106 and a QHY 163c color camera. Individual images were calibrated (bias frames only with the QHY data), debayered, registered (with 2x drizzle), combined and stretched in PixInsight.

The luminance data was merged with the color data in Photoshop CC.

The RCOS/FLI combo yields a 0.65"/pxl image scale, while the FSQ/QHY combo captures around 1.5" per pixel. Because I drizzle combined the color data, matching them up in Photoshop was much easier. I used auto-align in Photoshop...which is interesting because PixInsight had a tough time matching stars.

And herein is the difficulty with two diversely different scopes. Most everything matches up well in the images, except the stars. Despite the images being approximate size matches (after the 2x drizzle), the stars are wildly different! So, you have to employ some tricks there...either process some replacement stars from the wider-field image (the easy way), or try to keep the smaller, more plentiful stars of the narrow-field image (the hard way).

Of course, here, I chose the HARD way. They certainly are NOT great stars, but there is color on some of them...whereas the smaller ones simply become a neutral part of the background.

The ideal situation would be to shoot some RGB data with the RCOS, but sometimes you can only do what you have TIME to do! In fact, this RCOS has some severe issues, as you can see clearly by the crazy diffraction spikes on Alnitak.

Usually, the desire with multi-scale imaging is to take your wide-field data and highlight particular objects within the field with detailed data from the bigger scope. This is rather easy, and should probably be the way to approach things. However, as I show here, it is possible to do it the other way around...it's just a little trickier when it comes to the stars.

If you are going to buy two scope/camera combos, then anything close in image scale will work well. At that point, you could just throw all the data in a single stack. But as I show here, with a little gentle massaging of the data, even wildly diverse data sets can work well together.
