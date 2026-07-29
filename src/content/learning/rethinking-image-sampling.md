---
title: Rethinking Image Sampling
description: An in-progress article on image sampling in astrophotography.
order: 0
draft: false
unlisted: true
---

**Hypothesis**

"Signals should be understood in the domain where the information is encoded" (*The Scientist and Engineer's Guide to Digital Signal Processing* by Steven W. Smith).

Audio is understood within the frequency domain. The result should be understood by whether or not all the frequencies in the original recording can be identified. When we sample it, we only ask, "Is this sufficient enough to reproduce the highest frequency my ears can perceive?" There is no harm to "oversampling" other than the amount of processing power and storage required for more samples.

Images are interpreted in the spatial domain. The result should be understood by whether or not the image truly represents the capability of the imaging system, which is determined by the overall efficiency of the imaging system (i.e. scope resolution, seeing, mount performance). This is judged in the quality during "playback" of the encoded image itself, in the details captured and the absolute proper measure of the photons falling where they should.

For stars, this is determined by PSF — photons from the source arrive unpredictably... which means stars have a "sampling aperture" larger than the "sample spacing."

But spatial edges, which define areas of contrast (rate of change) within an image (both low and high frequency) is not modeled by a PSF because their light paths are more predictable.

...because the smallest areas of detail cannot be modeled by a PSF due to the very nature of them being UNDERSAMPLED with too few pixels to produce a PSF. As such, proper sampling of such edge details cannot be determined for certain, starting with a star's PSF as a minimum sampling criterium. But because the edge with the most contrast (highest rate of change per unit area) requires the highest rates of sampling to get them correct, then there are benefits to oversampling an image far beyond the Nyquist rate based on the star PSF. Nyquist, after all, is a minimum requirement. In many areas of the digital signal processing (DSP) world, 10x oversampling is not considered excessive.

We use star PSFs to determine sampling and focusing because it's the only objective measure of the data that we have. Because star PSFs are "low contrast details" in our images (requiring very low sampling rates to encode them), then they lack the true ability to determine optimum sampling in an image.

This is why the traditional measures of telescope aperture, Dawe's limit, and Rayleigh Criterium fail to predict why we can see much finer resolution when it comes to seeing something like the angular separation in Saturn's rings. While Dawe's models separation between lower contrast stars (weaker defined edges), it cannot possibly stand up to the scrutiny of the close, immediate changes within Saturn's rings.

Digital reconstruction of an analog signal uses pixels and image scale (a defined sample rate), but pixels (and pixel sizes) are not the limiting factor here.

Dynamic range is an amplitude — distinct levels of volume (sound) or illumination (images). High contrast is a rapid rate of change (D.R./area) over an amount of time (sound) or space (images). This is marked by high SNR. Low contrast is slow change (D.R./area) over an amount of time (sound) or space (images). This is marked by low SNR.
