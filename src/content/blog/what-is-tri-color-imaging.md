---
title: "What is Tri-Color Imaging?"
description: "An explanation of how astronomical CCD cameras, which only shoot in black and white, are used with color filters and luminance frames to build tri-color and LRGB astrophotos."
legacy: true
legacyCategory: "Astrophotography"
draft: false
---

Most people make the false assumption that an astronomical CCD camera, as opposed to a digital camera, takes color pictures right out of the box. These CCDs are black and white only, with few exceptions.

So, you might be asking why such an expensive camera is only black and white?

Each pixel sees ALL photons of light, regardless if that light is red, blue, or green. But to the pixel, it's just a level of brightness, not a specific color. Therefore, once the exposure is complete, you have many pixels mostly empty (the dark areas), some pixels mostly full (bright areas like stars and galaxy cores), and the rest have something in between (like the tendrils in a nebula or galaxy arms). The computer has no way of knowing how many of those photons were red, green, or blue.

Therefore, there are a few of ways to make color images.

If you could somehow make each pixel sensitive only to certain wavelengths, then you could make groups of three pixels, each with a red, green, and blue accumulation...much like a television or regular digital camera works. Problem with this method is that it's hard to make such a grouping of pixels small enough to eliminate pixellation and large enough to accumulate enough light.

Or, perhaps there is a way to sort the light waves as they hit the CCD and direct them to appropriate pixels. In a way, that's how Starlight XPress MX-7C and Apogee Lisa cameras work. Then again, it's just not very efficient and do not exactly measure the wavelengths accurately.

Lastly, you could use filters. When you place a red filter in front of the CCD, the only thing that reaches the CCD is red light. All other wave lengths are blocked. Therefore, you know that the image you accumulated are only those features of the object that are red in nature. Same goes for the green filter, then the blue filter.

Thus, you get three separate images, one with red details, one with blue details, and one with green details. Of course, each of these images are still grayscale images...shades of gray represent the information in each image.

However, if you take the "red" frame and put it into an image processor, the software then makes this image into a "redscale" images...pixels without much information are dark red and pixels with lots of information are light red. Same is true of the other colors. Of course then when you overlay the images, each pixel lines up on each other. So one pixel might be a little red, a little green, and a lot blue, the result of which is a dominantly blue pixel. Other pixels will have a different "mix" depending on what part of the object was shot. Think of each pixel having some combination of red, green and blue paint. Quite literally, a rainbow of colors is produced depending on the original color in the image.

Therefore, when you assemble a tri-colored image, you are essentially stacking three GRAYSCALE images, but each image has information that reflects the red, green and blue spectra respectively. Remember, each frame is still a black and white image until software does its thing. Perhaps if we delve into how a CCD chip works it will help explain the necessity of using filters for true color.

Once the photons hit a pixel, they are converted to electrons until the pixel is completely saturated (or the exposure is stopped), which happens if the object is really bright over that pixel and/or the exposure is long enough. On my ST-7E (anti-blooming chip), the chip has a "full-well capacity" of ~22,000 ADU (analog to digital units). This means that you have a range of ~22,000 electrons that can be converted, in some way, to a range of brightness values. So, you'd think that the A/D converter would make one electron equal to one brightness value. In other words, if the pixel accumulates 22,000 total electrons, then you'd think that your computer would show 22,000 possible shades of gray, but that's not the case.

For example, in a CCD camera designed for 16-bit output, the camera can theoretically output a range of 65,536 brightness values, 0 being total black and 65,535 being total white. But my ST-7 has a "gain" factor of 2.3, meaning that it takes 2.3 electrons to make up one brightness level. So even though this camera is 16-bit output, in actuality, each pixel can only exhibit 9,565 (22,000 divided by 2.3) possible brightness levels, or shades of gray. So, 0 is total black and 9,564 is total white. (BTW, the numbers are approximations.) This is also why in my histograms I never see any values above 10,000 in brightness level when a 16-bit camera is SUSPOSED to show up to 65,656 levels.

Therefore, if you have three grayscale images taken with various filters, the computer processes each tri-color part such that each pixels has 9,565 possible levels of brightness. Because the images are still grayscale, Photoshop knows to convert the red information to 9,565 possible levels of red, the blue information to 9,565 possible levels of blue, and the green information to 9,565 possible levels of green. But until you place each image into the individual RGB color "channels," the images are just black and white pictures.

So you aren't really "stacking" these individual images, are you? You are simply inserting them into a "channel" of a color composition. Truth is, if you "stacked" an image with red information, one with blue information, and one with green information...you'd get a black and white image! In other words, stacking is "additive" in nature. Put one pixel with a value of 50 over another pixel with a value of 20 over ANOTHER pixel with a value of 30 and you'd get a final pixel with a value of 100. So it would be the 100th level of GRAY even though the individual parts contained color information.

So, if the CCD array is tri-pixeled, meaning each piece of information is dictated by a set of three pixels each collecting a separate spectra, then those images could be stacked since they already have their colors. In other words, they are RGB images right off the chip. When stacking these, you aren't stacking pixel over pixel, but detail over detail. If the images are perfectly aligned, then the pixels will line up perfectly as well.

When an image is pieced together is this fashion, it is termed an RGB image. However, if you discarded all the color values (convert to grayscale) you are then left with an image similar to what my images have been, like shooting without filters.

But the problem is that we are not just collecting red, green, and blue light. Much of the objects we shoot have wavelengths in the ultraviolet and infrared red as well. Though our eyes can't see these wavelengths, the CCD can! Therefore, if you do tri-color images without blocking these wavelengths, the color information on each frame is distorted. But if you use filters for the tri-color frames in order to achieve proper colors, you lose the additional detail that the CCD sees in the UV and IR wavelengths. So, the question is, how can I preserve the colors accurately yet also show the information in the UV and IR areas of the spectrum?

Well, that's what LRGB images are all about. "L" stands for Luminance. It is a frame shot without any blocking whatsoever, so all the wavelengths are accumulated in the pixels. It is therefore a long, high resolution, grayscale image of tremendous depth and detail complete with UV and IR information. The "RGB" portions are the normal color frames.

When you combine these in an image processor, you get the complete detail of the luminance frame with the color information of the separate tricolor images. In fact, you can even take shorter, combined pixel images of the color frames, just enough to give the colors you need, and then combine that with the longer grayscale image. This works well because the eye isn't as sensitive to color as it is brightness levels. Thus, our eye sees detail better in the black and white images than the color images.

The result of the LRGB technique is normally spectacular, exceeding the range of an film mostly because film isn't sensitive in the IR spectrum (unless the film is IR film). Most film has some sensitivity in the UV, which is why many normal cameras come with a UV filter on the camera lenses, doubling as a scratch guard.

Many people refine the technique by using a luminance frame shot with an hydrogen alpha filter (not the same one as for the sun). This brings in specific waves of red light only, such as those in most emission nebula. The idea is that all other wave lengths are somewhat blocked except for the intricate details of the hydrogen gases. This requires a very long exposure, or stack of exposures, but the result is signal in the areas that you want it and very small star images, which is a good thing. Once put into an LRGB composite, you have something pretty incredible.

Incidently, the same techniques work for Oxygen (OIII) and even SII (sulfur) and hydrogen-beta. In fact, this is what the hubble does. It takes separate images with OIII, SII, and hydrogen-alpha as long luminance frames. Then, it inserts them into the color channels for green, blue, and red, respectively. The result is a "false color" composition of incredible detail and beauty.

Fortunately, we live in a great time. Amateurs are producing the same type of images. In fact, here is an example from Russell Croman using an RC scope, Tak mount, and SBIG ST-10 using a filter wheel loaded with special OIII, h-alpha, and SII filters. The image is M17, the Swan Nebula.

This is the hubble shot:

<!-- image not migrated: Hubble Space Telescope image of M17, the Swan Nebula, in false-color narrowband (OIII/H-alpha/SII) -->

This is Russell's shot:

<!-- image not migrated: Russell Croman's amateur narrowband image of M17, the Swan Nebula, taken with an RC scope, Takahashi mount, and SBIG ST-10 camera with OIII, H-alpha, and SII filters -->

Just jaw dropping! Can you find the part of the hubble image in Russell's wider scale image? Keep in mind that Russell took this image with a CCD camera in mag 2 skies, the middle of Austin, Texas. He accomplished this after only 2.5 years of imaging experience! But he's had great equipment to work with.

The term "false color" as I used it above simply means that the colors aren't realistic; not how we'd perceive them with our eyes.

True color would be combining three images with EXACTLY the proper red, blue, and green wavelengths. In other words, the red image should show ONLY red information, not green or blue or UV or IR. When we use filters to collect the information, it's not always perfect. For example the red filter might not block out some of the green, allowing some green information to leak into the red image. Same with the other colors.

Therefore, the true color images are those that use the BEST filters with the best transmission and blocking characteristics.

When you do images with H-alpha, OIII, and SII filters, you are collecting information in spectrums of actually 3nm spectral wide as opposed to 100nm. Put another way, a perfect red filter will block all wavelengths EXCEPT for those waves between ~600nm and ~700nm. But when you use an H-alpha filter, you aren't collecting all the red information, only the part of it at 656nm (plus and minus 1.5 nm with the Custom Scientific filter and plus and minus 10nm with my Lumicon filter). With a green filter, you'd collect everything between ~500nm and ~600nm. But when you substitute an OIII filter in its place you'd get only the information at 500nm (plus and minus 1.5 nm with the Custom Scientific filter). But what is interesting is when you replace the ~400nm to ~500nm blue spectrum with SulfurII. Sulfur actually glows at 672nm, in the red spectrum.

That's why it's called a "false color" image. Each portion of the tri-color does not represent information is the red, blue, and green spectra. In fact, I think Russell actually switches the assignments by using OIII as a substitute for BLUE and h-alpha as a substitute for GREEN and SII as a substitute for RED. Makes sense if you think about it and is probably more accurate in color rendition than the traditional substitutions, but it's still no where near "true" color reproduction.

When we see scientific images of these objects, we are seeing it in false color because it better shows the information that they want to communicate, giving obvious contrast between the different gases. That's the neat thing about these "false color" images. When you see green, you know its oxygen, when you see blue, you know its sulfur, and when you see red, you know its hydrogen.

Anyway, I hope this helps your understanding of CCD imaging even further.
