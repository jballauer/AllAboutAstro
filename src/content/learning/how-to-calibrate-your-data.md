---
title: How to Calibrate Your Data
description: An in-progress article on calibrating astrophotography data.
order: 0
draft: false
unlisted: true
---

When we talk about calibration of a CCD or CMOS chip, we typically mean applying flat fields, dark frames, and bias frames to a data set. But really, the goal of calibration is to make the CCD and the optics function predictably and uniformly across the entire surface of the imaging chip, from pixel to pixel. Let's look at some considerations for each type of calibration where I have some recommended practices you should follow.

***Flat-Fields...***

CCDs, being based on individual picture elements (pixels), do not typically act the same way, even though there are millions of them on today's large imaging chips. The issue is that not all pixels collect light at EXACTLY the same rate — they have slightly differing "gain" even if the chip itself is set to have a fixed, *average* gain. You see, we would have hoped that neighboring pixels would be identical in the amount of photons they collect, but this is not the case. In short exposures, the variance isn't great, but with longer exposures the differing pixel rate adds up to more error over time.

In practice, we can fix this difference in pixel gain by taking a "flat field" of the image and then mathematically dividing that image into our light frames.

This is called a "flat field" because it CALIBRATES the CCD to a flat rate of response over all pixels. It is done using mathematical division. For example, if the individual pixel gain is known (which is the purpose of the flat field), then you can simply divide that relative gain factor (an average pixel would be 1.000 while another might be .97 relative to that) and produce a calibrated image that compensates for the irregularity in sensitivity.

Now, here's the catch...because optical variances — light-falloff (optical inefficiency or hot spotting), dust motes, shadowing, and vignetting — act to affect "gain" in much the same way, the same flat field that CALIBRATES the imaging chip will also fix the optical variances. For example, if a speck of dust on the CCD cover window covers some pixels, then those pixels will have greatly reduced gain relative to the mean pixel gain. As such, the division of a flat field works the same way, bumping the gain of those pixels that is lost because of the dust speck.

In practice, you need to make sure that your flat fields are evenly illuminated so that all pixels can be accurately compared to one another. A relative gain of all pixels can be established accurately and this relative gain factor can be divided into each pixel.

To do this, you will need an even light source to take a picture of. This picture should be accomplished with the same optical configuration and focus, and with the same orientation of the camera. In filtered exposures, you'll want to take separate flat fields for each filter. And as a rule of thumb, you want to expose these flat fields at a length that yields roughly 30% to 70% of a chip's full well capacity (FWC) or where the camera's histogram peaks around that same percentage value. See the sidebar on Pixel Response Non-Uniformity for another reason why we take flat fields, but one you really don't need to concern yourself with.

<div class="ke-sidebar" data-width="wide">

## Sidebar: Pixel Response Non-Uniformity

Pixels suffer from another issue that you really don't need to worry about; albeit, it's nice to understand.

One of the assumptions we make about digital chips is that pixels are perfectly linear devices, meaning that they continue capturing photons at the same rate 10 minutes into an image as they did during the first minute. This, of course, is what makes them so much better than film, which died in sensitivity over the course of an image. And certainly, on average, the average pixels will maintain those sensitivity rates (known as quantum efficiency) over time.

But even if neighboring pixels have identical gain factors at the beginning of an image, they likely will not at the end of the image. This is because pixels do not always act uniformly in their collection rates. This difference in rate is known as PRNU or Pixel Response Non-uniformity. While these rates aren't all that perceptible at lower levels of illumination, they definitely start to pile up when areas of the sensor reach over 1/2 of their pixel well depths. And in fact, read-noise no longer becomes the main source of noise concern at this point, but rather PRNU.

While this can also be modeled out using flat fields, those flats can't really do their jobs on PRNU unless they are taken closer to the 70% or greater full-well capacity of the pixels.

However, as I mentioned, it's not an issue at all in practice. This is because when you have signal with those brightness levels on a chip, these areas are so rich in signal-to-noise ratio (SNR) that obsessing over the minor sensitivity variances at that level of saturation are just meaningless.

However, another issue that can cause differing pixel collection rates is that some digital chips use "gates" designed to reduce the number of charges in a pixel as the chip comes close to saturation. Such ABG (anti-blooming) chips will siphon off charges to prevent pixels from peaking in value and cause spill-over charges (or blooms) to leak down the chip in cascading fashion.

DSLRs fit into this category.

The gating charges, similar to PRNU, will not be of significance to you, since these bright areas will also be rich enough in SNR that it won't even be noticed in the final image.

However, if you wish to do science, where a perfectly flat response in the collector is required, then you will need a camera that doesn't gate its charges. These NABG (non-anti-blooming) cameras are a necessity for science, unless you are careful to keep your light frames at illumination values where the gating process has not yet begun. For the most part, in practice, it means avoiding pixel well capacities that are at least half filled with photon charges.

</div>

As for a preference in illumination sources for the flat fields, I really think that an Electro-Luminescent Panel (EL panel) is the way to go. These are expensive, especially at sizes large enough to cover bigger aperture telescopes, and with features like the ability to dim the brightness levels. However, if you get one big enough, they will work with all of your scopes. Likewise, it's not hard to DIY one of these. Once you have the materials, you can even vary the voltage with a potentiometer to give you a variety of brightness levels.

Many with smaller refractors just use a tablet computer (like an iPad) and set a uniform white screen with it. It works pretty well and can be adjusted in terms of brightness as well.

"Dome" flats are a possibility if you have a wall in the observatory that can be made completely white. If you shine multiple illumination sources at it, from a raking angle (from the side), you can produce a reasonably and evenly white background that will work for flat fields. If you do it this way, you will want to practice using a variety of lighting configurations to get the best result.

Regardless of the technique, these are excellent ways to shoot flat fields because they can be taken ANY TIME you want.

Sky-flats — shooting the sky shortly after sunset or before sunrise — can be accurate, but they require you to time your exposures well to assure optimum flat field exposure lengths. They also require you to work fast when you are using multiple filters (as with an LRGB filtered camera) and if you take multiple shots to form a flat field "master," which is advised. In other words, if you take around 8 to 10 exposures per filter (for good outlier rejection) for 4 filters each, we are talking between 36 and 40, perfectly timed shots. Wait too long and you might not squeeze all the exposures in before it gets too dark — and remember that all the filters attenuate varying amounts of light, so it takes a while to know the correct exposure sequence for the filters.

Many scripting/automation programs will do this for you, since they know how to scale the exposure times based on the changing illumination rates of the sky. However, truth be told, when I shoot sky flats, ***I'm just hoping for one good, perfectly imaged flat per channel.*** It's much better than no flat-field at all...and usually works much better than if I get overly ambitious and try shooting a whole bunch of master flats.

A "tee-shirt flat" is another commonly used technique. This is accomplished by stretching a shirt uniformly over the aperture end of a scope and pointing it up. However, you still run into some of the same issues as sky flats because you still are relying on your ability to get good illumination. You can use a "thicker shirt" and do the flats before the sun goes down, but I find it difficult to accomplish without at least some linear gradient in the flat field.

Whatever method of flat-fielding you choose, I have to let you know a little secret...I use the same flat fields for ever...I mean like for 6 months or so. I know, you've been told that flats cannot work once you've rotated your camera, which you've most certainly done. But here's the thing...dust motes, which cause the specks and donuts in an image, typically rotate along with the camera. Such things will normally be either on the filters or the CCD/CMOS cover window itself. Nothing on the actual primary or secondary of the scope (which doesn't rotate) will be seen in the flats. Therefore, my recommendation is that if your camera is properly placed on axis and is orthogonal to the optical axis, which means that your vignetting pattern and/or optical hotspotting will be very uniform at all positions of the camera, then flat fields will still work for you even after you rotate the camera. I typically retake flat fields when convenient, or if I see that my dust patterns have changed somewhat over time enough to affect the image.

Finally, an important point about flat-fields — I consider them a "2nd Order" Practice. This means that there are software techniques that can, at least partially, work in place of true flat-fields. Likewise, you run a risk of doing more harm than good if you aren't really sure about what you are doing. In the next part on "How To Assess," I will go into how you can evaluate success here, but just know a great image doesn't have to depend on perfect flat fields.

***Dark Frames...***

When we calibrate an image, it usually means that we apply ***dark frames*** as well. Dark frames (or just "darks"), are an exposure taken with the lens cap on (totally black) of the same duration and temperature of the light frames. These are necessary because the pixels of a CCD do not have the same gain for yet another reason — gain changes with temperature and exposure duration. Thankfully, these changes are VERY predictable, meaning that if you can take an image of total "darkness," then the result will be a "perfect picture" of this thermal signal (thermal noise is something different).

But the nice thing is that all you have to do is ***subtract*** that dark frame mathematically from the light frames to rid yourself of these thermal fluctuations of signal.

A few bullet points about how you need to practice in light of this...

- Because the "salt and peppery" specks caused by the unwanted thermals are "signal," there was still a slight variance in those pixel values that comes from "shot noise." This means that although you are able to accurately subtract the thermal signal with a dark frame, those affected pixels will still show a slight variance just like your good signal areas do. This means you are better off not having any thermal issues to begin with.
- In practice, if the camera is thermal-electrically cooled (TEC), then you will want to run it at a set-point which optimizes the cooling of the chip without running the risk of fogging the cover glass over the chip.
- You will also want to choose a camera with good cooling performance or good thermal characteristics. For example, some chips are inherently cleaner and less affected by heat than others. And for those cameras that tend to let you know when you've imaged for a long exposure in the summer months, you really need to be sure that the camera's TEC is equipped to do the job. For example, my old STL-11000 with KAF-11000 chip needed about a -15c or better set point to limit the thermal signal...which is something I have difficulty achieving in my hot Texas months when the night temperatures push 30c or more. As a rule of thumb, many such cameras will cool to 30 or 40 Celsius below ambient, which just isn't enough for when Texas wants to act like Texas. Conversely, my FLI FL-16803 has an amazing chip that only needs around -5c before I reach a point of diminished returns. And because the cooler is much better, I don't have issues running the chip cool enough.
- You see that elephant over there...the one in the room? Yep, it's a DSLR and I'm sure you are wondering what I think about shooting darks with it? Naturally, DSLRs do not come stock with a cooler. So, I ask you, knowing the purpose of a dark frame...do you think darks are going to help? Think it through. What makes them work with TEC cameras is that the entire duration of the exposure is locked into place at your set-point temperature. This is true for BOTH the light frame image and the dark frame. Because a DSLR can't be certain of that, especially since the camera's own electronics greatly heat up during the course of long exposures, then you aren't going to get good modeling of that thermal data. ***Consequently, I don't do dark frames with DSLR cameras.*** Now, if you think it works, then by all means keep at it; however, you really need to know for sure if it's working, which is something we can talk about in the "How to Assess" section of the article.
