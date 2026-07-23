---
title: The Flame and the Horsehead - A Multi-Scaled Approach
description: A 2-frame mosaic of NGC 2024 and B33 (with NGC 2023) in Orion.
pubDate: 2019-10-01
image: ./_images/flame-and-horsehead.jpg
equipment: "Takahashi FSQ-106 (RGB) and 12.5\" RCOS Ritchey-Chretien (luminance) on a Software Bisque Paramount ME"
exposure: "7 hours 56 minutes total"
draft: false
---

A two-frame mosaic combining the Flame Nebula (NGC 2024) and the Horsehead Nebula (B33, with NGC 2023), processed as an LLRGB multi-scaled image.

<div class="ke-two-col">
<div class="ke-two-col-specs">

<p><strong>Location:</strong> Taken remotely from Grapevine, Texas</p>
<p><strong>Observatory:</strong> The Conley Observatory, Comanche Springs Astronomy Campus (3RF) near Crowell, Texas</p>
<p><strong>Date:</strong> October 2019 (RGB) &amp; November 2017 (Luminance)</p>
<p><strong>Scopes:</strong> Tak FSQ-106 (RGB) &amp; 12.5" RCOS Ritchey-Chretien (Luminance)</p>
<p><strong>Mount:</strong> Software Bisque Paramount ME</p>
<p><strong>Cameras:</strong> QHY 163c (RGB) &amp; FLI Proline PL-16803 astronomy camera (Luminance)</p>
<p><strong>Exposure Info:</strong> LLRGB multi-scaled image. Clear luminance taken with the PL-16803 unbinned in two frames. 120 minutes for the Flame Nebula and 170 minutes for the Horsehead (10 minute sub-exposures). Color data taken with OSC (one-shot color) QHY 163c in 3 minute subexposures (Gain: 2; Offset: 25) for a total of 186 minutes RGB.</p>
<p><strong>Total Exposure Time:</strong> 7 hours and 56 minutes</p>
<p><strong>Processing of Grayscale Frames:</strong> Calibration, star alignment, and integration of individual frames done within PixInsight. Each frame received Multiscale Linear Transform, Dynamic Crop, and Histogram Transform. Grayscale frames assembled in PixInsight using Gradient Merge Mosaic process. Noise reduction and local contrast enhancement (in select areas) performed in Photoshop CC (using ProDigital Actions) on the full mosaic grayscale frame.</p>
<p><strong>Processing of Color Frames:</strong> Calibration (bias frames only; no dark or flats), batch debayering (BGGR), star alignment, and integration (with 2x drizzle) of individual frames done within PixInsight. Each frame received Multiscale Linear Transform and Histogram Transform in PixInsight.</p>
<p><strong>Processing of LLRGB:</strong> Luminance and RGB images brought into Photoshop CC and aligned (smart-align). Color frames were balanced, heavily saturated, and cleaned of noise (a variety of techniques). Stars were reduced in size using multiple iterations of "Make Stars Smaller" action (using ProDigital Actions) and then Gaussian blurred. Luminance was blended with RGB data using Color blending mode. This process was repeated several times to control stars and to color balance the image.</p>

</div>
<div class="ke-sidebar ke-two-col-about" data-color="teal">

<h2>About this Image</h2>
<p>The other day, a friend of mine asked a question about multi-scale (or hybrid) imaging. He was considering two scopes with similar cameras to be used simultaneously and he was curious about how optically close the scopes need to be in order to mix together the data. I stated that they didn't need to be all that similar and that I use mixed data all the time.</p>
<p>Here's an example, an image that I completed the other night. Clear-filtered luminance for this image was acquired in November, 2017. It is two frames, 120 minutes of the Flame Nebula and 170 minutes of the Horsehead using a 12.5" RCOS RC and FLI PL-16803 astro camera. This was preprocessed and stitched together in PixInsight.</p>
<p>The color information was shot two nights ago, 186 minutes using the Tak FSQ-106 and a QHY 163c color camera. Individual images were calibrated (bias frames only with the QHY data), debayered, registered (with 2x drizzle), combined and stretched in PixInsight.</p>
<p>The luminance data was merged with the color data in Photoshop CC. The RCOS/FLI combo yields a 0.65"/pxl image scale, while the FSQ/QHY combo captures around 1.5" per pixel. Because I drizzle combined the color data, matching them up in Photoshop was much easier. I used auto-align in Photoshop...which is interesting because PixInsight had a tough time matching stars.</p>
<p>And herein is the difficulty with two diversely different scopes. Most everything matches up well in the images, except the stars. Despite the images being approximate size matches (after the 2x drizzle), the stars are wildly different! So, you have to employ some tricks there...either process some replacement stars from the wider-field image (the easy way), or try to keep the smaller, more plentiful stars of the narrow-field image (the hard way).</p>
<p>Of course, here, I chose the HARD way. They certainly are NOT great stars, but there is color on some of them...whereas the smaller ones simply become a neutral part of the background.</p>
<p>The ideal situation would be to shoot some RGB data with the RCOS, but sometimes you can only do what you have TIME to do! In fact, this RCOS has some severe issues, as you can see clearly by the crazy diffraction spikes on Alnitak.</p>
<p>Usually, the desire with multi-scale imaging is to take your wide-field data and highlight particular objects within the field with detailed data from the bigger scope. This is rather easy, and should probably be the way to approach things. However, as I show here, it is possible to do it the other way around...it's just a little trickier when it comes to the stars.</p>
<p>If you are going to buy two scope/camera combos, then anything close in image scale will work well. At that point, you could just throw all the data in a single stack. But as I show here, with a little gentle massaging of the data, even wildly diverse data sets can work well together.</p>

</div>
</div>

Taken remotely from Grapevine, Texas at the Conley Observatory, Comanche Springs Astronomy Campus (3RF) near Crowell, Texas. October 2019 (RGB) & November 2017 (luminance).

<div class="ke-ai-stub">
<span class="ke-ai-stub-badge">🤖 AI-drafted &middot; unverified</span>

<dl class="ke-ai-stub-facts">
<dt>What it is</dt>
<dd>The Flame Nebula (NGC 2024) and Horsehead Nebula (Barnard 33, with the reflection nebula NGC 2023) sit side by side near the star Alnitak in Orion's belt.</dd>
<dt>Constellation</dt>
<dd>Orion</dd>
<dt>Distance</dt>
<dd>~1,350 ly (NGC 2024); ~1,375 ly (B33)</dd>
<dt>Apparent magnitude</dt>
<dd>N/A &mdash; dark nebula and diffuse emission region</dd>
<dt>Angular size</dt>
<dd>~30 &times; 30&prime; (NGC 2024); ~6 &times; 4&prime; (B33)</dd>
<dt>Coordinates</dt>
<dd>near Alnitak: RA 05h 41m, Dec -02&deg; 24&prime;</dd>
</dl>

<p class="ke-ai-stub-desc">This summary was generated by an AI assistant from general astronomical references, not from Jay's own notes on this specific image. Treat every detail above as a starting point for research, not settled fact.</p>

<div class="ke-ai-stub-footer">
<span class="tag">Verify further:</span> <a href="https://en.wikipedia.org/wiki/Flame_Nebula">Wikipedia: Flame Nebula</a> &middot; <a href="https://en.wikipedia.org/wiki/Horsehead_Nebula">Wikipedia: Horsehead Nebula</a>
</div>
</div>
