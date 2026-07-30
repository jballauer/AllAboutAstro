---
title: "Basic Imaging Methods: Shooting the Moon"
description: "A practical guide to imaging the moon, from camera setup and focusing through stacking decisions and Photoshop processing."
legacy: true
legacyCategory: "Astrophotography"
draft: false
---

<!-- image not migrated: "Moon121904LRGB640.jpg" - lunar image taken Dec. 19, 2004 with a tricolor astronomical CCD camera and 4.2" refractor. Caption: "Lunar image taken on Dec. 19, 2004 with a tricolor astronomical CCD camera and 4.2" refractor. Click on the image to see larger resolutions and details." -->

Amateur astronomers and astroimagers tend to treat the moon as light pollution. When its up, we're inside!

But on the occasion when we find ourselves looking at the magnificent craters, rilles, mountains, and maria of our celestial neighbor, we wonder why it is again that our moon catches so much flak!

The moon is the easiest object to shoot in the sky. Why? Because you can use any camera, on any mount, with any scope or lens to catch good shots. The moon is so bright that it requires simple, short exposures, which vary in length depending on its phase.

Digital technology makes getting decent lunar images a breeze. Just setup the scope with a decent eyepiece, hold the camera up to the eyepiece, and shoot. If you don't like the result, throw it out and try again!

### Image Setup

If the moon takes up enough of the field of view, a camera with auto-focusing capabilities might actually do the focusing for you. It's worth a try if your camera has this feature. But for the most part, manually focusing the image will be required.

The best method would be to purchase an adapter to hold your camera to the eyepiece, thus freeing your hands to work the camera and to align your scope. Your focus should be close prior to hooking the camera to the eyepiece, but you'll notice that the actual act of hooking up the camera to the eyepiece will throw off your focus slightly. For "point and shoot" digital camera users, you'll use the LCD display as a visual guide to make sure you have proper focus. With SLR cameras, you'll use the camera's viewfinder. At this point, focusing should be done using the scope's focuser, not the camera itself.

As a rule, you shouldn't use the camera's built-in zoom functions since it doesn't actually add detail to the image. If you need more detail, you should use a more powerful eyepiece. Instead, you should use only enough zoom that will get rid of the "vignetting" in the image. Vignetting occurs because the camera's chip is larger than the "hole" you are shooting through. It shows up as dark circle around the frame. Sometimes, enough zoom can be applied to rid yourself of this nuisance. But more than likely, you'll just crop the image later in processing.

For best results, shoot the moon when at its quarter phases or less. This allows you to capture great details along the moon's terminator while keeping the moon's bright light somewhat attenuated.

Simple stuff, right?

### Getting It Right

Unfortunately, many people who have been shooting the moon for years will be the first to tell you that shooting the moon is a hard thing to master. Decent images are easy, but great ones are tough! This is true for many reasons:

- Focusing a shot that shows the full lunar surface is difficult because the face of the moon tends to have a different focus than the limb (edges).
- The moon has the greatest dynamic range of any object. It's tricky to process because you need to give equal balance to all brightness levels without over-saturating the bright areas or over-darkening the dark areas.

| Pertinent Definitions | |
| --- | --- |
| **Stacking** | The process of aligning and then averaging several digital images in order to decrease the "noise" in an image. |
| **Signal/Noise Ratio (S/N)** | The ratio of the amount of predictable, wanted parts of an image to the unpredictable, unwanted portions of an image. |

- The moon is a shifty thing, bending, moving and blurring with atmospheric conditions, known as "seeing." This means that the first shot you take will not likely be the best.
- The brightness of the outer portions of moon can cause chromatic aberrations, or a bluish fringe when using lesser camera lenses and achromatic refractors.
- The moon actually has color, which is very tough to shoot correctly. Most people shoot the moon in grayscale (black and white) to avoid these issues, but if you try your hand at color, there will likely be problems, either with chromatic aberration, atmospheric effects, or because of alignment issues when shooting tri-color. Using a mirrored scope gives you the best chance at success when doing color imaging.
- A full moon can actually be too bright for some cameras such as with over-sensitive, dedicated astronomical CCD cameras. Shooting at high focal ratios of f/30 to f/40 is often the only way to make such cameras work with a given setup.

All these are important factors to consider when trying to get the perfect lunar image. But because we are people who gravitate to trends, there's something else that deserves to be discussed in its own section.

### To Stack, or Not to Stack...

Much has been made about "stacking" images. Free programs like Registax 2.0 can allow you to take multiple images, or even a video of the object, and then stack the individual frames together in processing. However, it should be said that stacking lunar exposures is generally NOT a good idea. Most people will discover that a single frame image of the moon is the best bet. Why? Because as mentioned earlier, atmospheric seeing makes the perfect alignment of a stack of images very difficult. No matter how good the software, there will always be slight variations in crater shapes and sizes that do not align properly in the final stack of images. While the differences are often subtle, there will be areas in a stack, especially in crater littered fields, that look "overlaid" or lack sharpness.

What the lunar photographers should keep in mind is that image stacking is actually done for one reason and one reason alone: to remove noise from the image. The need for stacking becomes apparent when using any camera that has low sensitivity. This is because such cameras have difficulty overcoming the natural read-noise (noise floor) in an image, or the noise that is naturally a part of the camera regardless of how long the shot is. If the camera is not sensitive enough, it likely will not catch enough photons in the first place, at least not enough to overcome the read-noise.

A webcam is just such a camera. Same goes for an video camera or recorder. In fact, because shooting in video mode breaks down into rather noisy subframes, it makes sense to choose many of the sharpest subframes and average them together in software. In fact, stacking is required to take good lunar images with a high signal-to-noise ratio (S/N).

For those uninitiated to the idea, when you perfectly align images together, the good parts of the image, known as "signal," will be in the same place. Because many forms of noise are often random in nature, each image in the stack will weaken the affect of the noise in the final average. The result is one final image that represents the best of each subframe.

If you have to stack your images in order to overcome noise, then choose only enough images to give you a good, clean image. Adding more images is unnecessary and you run the risk of corrupting the final stack by throwing in a subframe that doesn't quite fit. Therefore, if your camera has the capability to shoot nice, single frames with minimal noise, then most often you will find that the best single shot during any given imaging session will yield a better result than stacking.

### Processing Your Image

Once you have your single or stacked image, you are now ready to process it. Most image processing software will allow for basic "stretching" of the image and some form of sharpening. Essentially, that is all you really need. For this example, I'll be using Adobe Photoshop.

Open the image and choose the Levels command. Within levels you'll see the "histogram," which is essentially a graphic representation of the number of pixels in the image at their brightness levels. The left of the graph will be the pixels with the darkest values. The right of the graph will be those with the brightest values. In a good lunar image, you'll notice that the histogram takes the shape of a hill, slowly rising up toward the center of the graph and slowing falling towards the right edge. If your histogram doesn't look like this, then your task is to make it so!

To give the background its proper level of illumination, drag the small triangle at the left side of the graph until it hugs up against the left edge of the hill. Do the same to the right side using that triangle. Just be careful not to "clip" the histogram by going too far. Clipping at the left side will cause a loss of data. Clipping at the right side will over-brighten areas of the image.

What you just performed is known as a "stretch" of the histogram, where you essentially equalized the brightness values across the entire range of illumination levels. At this point, the image should be quite improved.

If there is more "hump" to the left of the histogram than to the right, or vice versa, then the Curves command might come in handy. It's too much to get into here, but experimenting with this tool is worthwhile. Likewise, using the "Auto Contrast" command might give you the same effect. Whatever you do, always check the histogram for clipping and/or balance. The more you understand the histogram, the more power you will get from your processing.

Finally, a little sharpening provides the final touch! Using the "Unsharp Mask" filter, apply a small amount of sharpening at 100%. 2 pixels will likely be too much. To bring out small, more localized contrast in the image, you might also try a large radius, 20% filter...just don't tell anybody...it's a trade secret!
