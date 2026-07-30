---
title: "Does Light Pollution Affect CCDs?"
description: "Why CCD cameras handle light-polluted skies so much better than film, and how signal, noise, and gradient removal work in practice during image processing."
legacy: true
legacyCategory: "Astrophotography"
draft: false
---

One of the things I struggled with when I first started with CCD imaging was figuring out how CCDs can possibly work in light polluted skies. I'd heard that CCDs worked well in such skies, where film fails. As a film guy, it was difficult to fathom. If film could be fogged out by light pollution, and CCDs are faster, then it seemed to me that a CCD would be fogged out by light pollution—FASTER.

I built my own observatory knowing that CCD cameras were supposed to be the equalizing factor for my suburban, light polluted skies. Unfortunately, I hadn't experienced this first hand. So for a while, I neglected to take full advantage of CCD cameras, and my observatory, to capture shots from my home, where film doesn't dare to tread.

It wasn't until I began taking some images, and then processing them, that I first began to understand the greatness of astronomical CCD cameras. And it's at that point that I realized I needed to put more money into my incomplete observatory to bring my initial plans to full fruition. Time to paint it—time to fit out the interior—time to run power! Arh! Arh! Arh!

You see, what I had to learn about CCDs is that they aren't like film. Film dies during a long exposure. It's not an immediate death, but rather a gradual dying over time. It's the rate of death that poses the problem. At a certain point in an exposure with film, the sky glow coming from light pollution begins to overwhelm the good stuff; the galaxies, the nebulae, the clusters, the stars. This good stuff is what we call SIGNAL. It's the light we want to capture on the film or CCD, not the unwanted stuff. So, the brighter the sky, the faster that film death occurs: the point at which the amount of light pollution or "NOISE" exceeds the amount of signal.

CCDs don't suffer this problem. They don't die. In fact, the problem CCDs have with light pollution is not that LP completely overwhelms everything to the point that you can't see the signal. While there is a point where this is true (like trying to image in the daytime), suburban skies are almost always dark enough to allow at least some signal through. And as long as a little signal gets through, then you can capture very lengthy exposures with the confidence that the amount of signal you get will always increase more than the background glow. Unlike film, this works because the CCD exposures are linear in fashion; they accumulates light at the same rate after an hour as they would after a minute. Film can't do this; it's not linear. It weakens. It dies. At some point in a film image, the emulsion slows down to the point where the amount of noise overwhelms the signal.

And because, under these conditions, a CCD chip will always accumulate signal at a faster rate than the noise (film does this too, at first, until the signal rate slows enough for the noise to catch up), all you need is more exposure time to make the signal standout the way you want it. In other words, the rate (which is constant) at which a CCD takes in more signal than light is dependant on the amount of light pollution or background brightness. The darker the skies are, the faster the rate. The brighter the skies are, the slower the rate. Therefore, slower signal/noise rates require longer exposures. For example, in magnitude 2 skies it might take 30 minutes to get a good picture of M33 whereas the same picture in mag 7 skies might take 3 minutes. The more LP you have, the longer the exposures need to be to compensate for it.

So what most suburban imagers will do is take many exposures between 5 to 20 minutes a shot and combine them in software. The importance isn't so much the length of each exposure as it is the amount of TOTAL exposure time.

Perhaps if I explain part of the method for processing an LP image, you might see more clearly.

> **Pertinent Definitions**
>
> **Signal** - The good light in an image which comes from stars, galaxies, nebulae, clusters, and solar system objects.
>
> **Noise** - The bad light in an image which comes from flaws in a CCD chip, dust on the optics, light pollution or skyglow, unwanted meteors, and cosmic ray hits.
>
> **Gradient** - The effect of light pollution on an image where the sky background is not evenly illuminated.
>
> **Calibration** - The process of removing unwanted noise from a picture using flat fields, dark frames, and combining operations.

Once you get the image from the camera into the computer, the first thing you do is check the levels of each pixel in the image. In a 16-bit camera, you'll get a total of 65535 possible levels of brightness in any single pixel. This might be the 0 value for total black, the 65534 level for total white, or any of the points of gray in between. What happens in any CCD image is that once you open the program, the darkest part of the image, the background, is not 0 level, like you'd hope it would be. Instead it is the value dictated by how bright the sky was when you took the image. This brightness might be caused by LP or just the natural glow of the sky. Regardless, there is no total black, or 0 level, in the image.

But that's easy to fix. All we do is subtract the value of the darkest pixel in the image from every other pixel. So, we do something called PIXEL MATH. If the darkest pixel is at level 2400, then we tell the software to subtract that number from all pixels. The computer complies and we end up with an image that no longer has the background illumination.

Now, this is all well and good if the background light is equally illuminated, having close to the same number value in each pixel (it's easy to know what number to subtract this way). But what light pollution does is it causes the background to lose that uniformity we desire. A GRADIENT develops in the background of the image, spanning from the direction of the source of the LP all the way across to the other side. So, if we were to take the lowest pixel value and subtract it from all pixels, what we get is simply a darker gradient. Not all of the noise disappears.

So, we need a way to map out the amount of noise in each pixel. MaxIm DL does this automatically on some images by detecting the variance of certain pixels away from the darkest one, then it applies the appropriate amount of math in order to equalize the background. Or, we can do it manually in Photoshop by creating a duplicate of the gradient, then subtracting it from the actual image. If the LP is severe, then there might be more than one gradient, perhaps one in the direction of the sky's light dome and another from a local light source being reflected directly into the scope. So, the objective is to discover all gradients, or things that are keeping the background from becoming uniform, and then subtracting them from the image. The result is PURE SIGNAL.

In fact, dark fields and flat fields work under the same principle. Hot pixels from the CCD need to be subtracted because they make some pixels differ from the norm. Internal reflections and dust on the elements or the chip itself can cause some pixels to differ from the norm. Therefore, in performing a complete CALIBRATION of the image, you manage to get rid of all types of noise. Dark frames get rid of hot pixels. Flat fields get rid of obstacles in the optical train. Gradient subtraction gets rid of LP. And multiple combining of several images (median combining) gets rid of everything else like cosmic ray hits and meteors.

The hotter the CCD chip and the longer the exposure, the more important dark frames become. The worse the optics (from a dirt and glare standpoint), the more important flat fields become. The worse the LP, the more important gradient removal becomes.

The determination to take short individual exposures or long ones depends on many factors. Can your mount sustain accurate tracking during long exposures? Are there wind gusts that may ruin a longer exposure? Do you experience lots of cosmic ray hits or meteors requiring a greater number of exposures to combine? So you generally take as long an exposure as you safely can consistently...that's the trick! If the mount sucks, or the guiding is inaccurate, of the alignment is off, or you are imaging in the middle of Hurricane Hugo, then you'll be limited to shorter exposures.

But what it all comes down to is TOTAL exposure time. If you want an hour of signal, then you can do two 30 minute exposures, twelve 5 minute exposures, or sixty 1 minute exposures. The results will be very close to the same and the dark the skies, the more signal that is obtained. If the LP is too bright, then it might take an hour to get enough signal that a 5 minute shot would show in dark skies.

As far as dark frames are concerned, if you take 5 minute individual exposures, then you need a 5 minute dark frame for the appropriate subtraction. The dark frames are removed prior to combining the images. Therefore, if you combine both 5 minute and 30 minutes exposures, then you'll subtract a 5 min dark from each 5 minute light frame and a 30 dark from each 30 minute light frame. Then, you'd combine them. Incidently, most people take images of consistent lengths. It you take images at varying lengths, each at a different CCD temperature, then you can see how many dark frames you'd need to collect! I have darks 1, 2, 5, 8, 10, 15, 20, and 30 minutes, each at both -25 degrees C (during summers) and -30 degrees C (during winters). Everytime I take an exposure of a different length, or a different temperature, then I need to add to my library of dark frames.
