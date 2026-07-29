---
title: Digital Imaging 101
description: An in-progress introductory article on digital imaging.
order: 0
draft: false
unlisted: true
---

Digital imaging chips are made of a semi-conducting material, silicon. This serves as a substrate for a large number of light-sensitive elements. Because of the semi-conducting nature of silicon, the CCD chip is able to trap and store charges induced by photons. Within the silicon, photons are captured by a grid of "picture elements" or "pixels," which are defined by an electrode strip, known as a "gate," which carries the accumulated charges, row by row, across the chip at the time of read-out (or "charge transfer"). This is accomplished by being piggybacked or coupled to a clocked, electrical charge carried across the gate structure; hence, the origin of the term "charged-coupled device."

The pixels themselves contain the areas on the chip that are "photo-sensitive." These photo-sensitive areas are comprised of metal oxide semiconducting (MOS) capacitors. It is common to refer to the MOS capacitors by their collection areas, known as "photo-sites," which is the preferred nomenclature here. The distinction between "pixel" and "photo-site" is important because, depending on the type of CCD, the entire pixel is likely not photo-sensitive. Therefore, the total number of pixels and/or pixel size is not necessarily indicative of the total area of photo-sites on the CCD chip, which plays into the chips overall "sensitivity."

*(insert illustration of individual "light-buckets" here)*

## CCD Basics Primer

Once photons, regardless of the wavelength (e.g. red, green, blue, near-IR and UV) hit the CCD chip, they are collected into small "buckets" or pixels until they are completely saturated (or the exposure is stopped). Bright objects fill up the pixels faster, of course. Longer exposures assure that some pixels will eventually fill up with a steady rainfall of light. When a pixel is full, it is said to have reached its "full-well capacity," some pixels before others. Depending on the CCD chips, pixels can have differing capacities for the light that its pixels may hold. Whatever that full-well *limit* is, this is the "point of saturation," when the pixels cannot hold any more light. Regardless of how much light is collected, each photon induces an electrical charge on the chip at the equivalence of a single electron. Thus, photons can be recorded electrically and counted digitally, much different than in the days of film.

In the ideal case, an ADU count equal to 0 represents total black (technically its 100 ADU because the camera maker adds a steady 100 e- charge ***"off-set"*** to each pixel). An ADU count equal to 65,535 could represent total white in a 16-bit system. I say "could" because a standard 16-bit ADC will not be the equivalent of the CCD's full well capacity, which could be much more or much less than 16-bit's worth of information. But to compensate, the full-well depth is typically divided by bit-depth of the ADC to produce a factor known as the ***"gain"*** of the CCD. This level of gain varies for every camera.

<div class="ke-sidebar" data-side="right" data-width="wide">

## Sidebar: CCD Imaging Vocabulary (A to Z)

- **ABG camera** - Meaning "Anti-Blooming Gates" - A camera with pixel gates to stop the occurrence of blooms within an image. This causes pixels to stop performing linearly once they are around 1/2 full, which needs to be taken into account if doing accurate photometric measurements.
- **ADC** - Meaning "Analog to Digital Converter" - In electronics, an ADC is a device that takes analog signals, such as electrons and counts them for use later in an electronic circuit.
- **ADU** - Meaning "Analog to Digital Units" - This is the counting unit for the representation of counted signals. In digital cameras, it's the total number of electrons (e^-) that may be counted by an ADC.
- **Astro CCD** - A camera type differentiated from DSLRs and webcams (video cams) in astronomy. Typically, a gray-scale-only camera with built-in cooling that requires filters to produce color data.
- **Bayer Matrix** - The most popular form of color filter array.
- **Binning** - The ability to create larger "super" pixels from individual pixels, yielding lower sampling rates and fewer pixels to "read-out." It raises image signal-to-noise ratio (in some scenarios) at the expense of image resolution.
- **Bit-Depth or Bit-Rate** - The total number of digital registers of an ADC, usually in 8-bit, 10-bit, 12-bit, 14-bit, and 16-bit standard types. "Bit" pertains to the power of 2 (like binary). Thus, something that is 8-bit would be 2^8 power, or 256 distinct levels.
- **Blooming** - A cascade of bright spikes in an image caused by full-pixels spilling over into neighboring pixels. They require post-processing to remove them from an image.
- **Broad-band Filtering** - Allows much larger bands of spectral information to pass. Typically, these are either RGB filters, which each transmit ~100nm of information depending on the filter color, or UVBRI filters, used in Photometry. IR-filters (typically a long pass filter near 700nm and higher) pass only near-IR light, are often used in planetary imaging. Light-pollution filters are typically "broad-band" as well, since they can pass multiple spectral lines at slight wider peaks (especially around sodium, mercury, and other discharge lines popular within typical lighting forms).
- **CCD** - Meaning "Charge-Coupled Device" - Often used as a generic term for all such light-collecting silicon sensors including CMOS. Fundamentally, it collects light photons as electrical charges, which is read-out by moving charges along registers on the chip. More expensive to manufacture, CCD chips have high-sensitivity because read-out electronics do not compete with the photo-sensitive areas of the chip.
- **CMOS** - Meaning "Complementary Metal-Oxide Semiconductor" - A technology where each pixel utilizes transistors to count charges, meaning pixels can be read-out separately. Cheaper to manufacture, the CMOS loses some sensitivity because less of a pixel's surface area is available to photo-sensitivity due to the read-out electronics embedded with each pixel.
- **Color Filter Array or CFA** - Color filtering at the pixel level, where each pixel has its own red, green, or blue color filter. The total array can produce color images upon readout through a process known as "interpolation."
- **Cut Filters** - A filter that cuts spectral information from a large band, typically either cutting out near-infrared or ultraviolet light.
- **DSLR** - Meaning "Digital Single Lens Reflex" - The modern, digital equivalent of an older film SLR, used mostly by professional and "prosumer" photographers, as well as many in the astronomy hobby.
- **Dynamic Range** - The ability of a camera to record distinct levels of contrast in an image, typically measured in photographic "stops." Practically speaking, this is a measure of a camera's bit-depth divided by its read-noise. A reduction in dynamic range occurs at higher gain levels (ISO) and in deconvolution (sharpening) of an image in post-processing.
- **Fill Factor** - The percentage of photo-sensitive areas in a pixel compared to the total available area for each pixel. Read-out electronics take up space within CMOS pixels and thus has lower fill factors and less overall sensitivity.
- **Full-Well Capacity or Depth** - The total amount of electrical charges (electrons) that can be held by a single pixel.
- **Gain** - A ratio of the bit-rate of the ADC divided by the Full-well Capacity of a pixel. Practically speaking, it's the number of actual photons represented by a single level of ADU count. Higher gain levels have the "illusion" of more sensitivity at the expense of dynamic range. The word illusion in that context requires another article to explain!
- **HaRGB** - Same as an LRGB image, only using a hydrogen-alpha (Ha) filter to collect luminance data. The technique works well for hydrogen-rich emission sources, such as extended nebula. A difficult image type to process due to the fact that very little of the h-alpha data matches well to data taken through RGB filters.
- **ISO** - The ability to set a custom level of gain in a camera like a DSLR. Itself a throw-back to film days, ISO originally mimicked the varying levels of film sensitivity (ASA).
- **Long-Pass Filter** - A broadband filter with a "cut-in" but no cut-off.
- **LRGB** - Meaning "Luminance, Red, Green, and Blue" - An image where detail information is conveyed through grayscale luminance and color information is conveyed through the RGB filters. Processing programs, like Photoshop, have the ability separate luminance from the chrominance as separate layers, taking advantage of techniques specific to each type of image. Shooting luminance allows the entire chip to collect available light, unlike RGB alone which would be synthesized from filtered exposures. This significantly raises the signal-noise ratio of an image per available exposure time.
- **Luminance** - Image data that shows details irrespective of color or spectral information. In the human eye, it is the detailed black/white information received from the rods. In imaging, it is a grayscale, filterless image (cut filters and spectral band filters are sometimes used) that collects the majority of an images signal-noise ratio, yielding spectrally efficient images.
- **Microlenses** - A transparent lense above non-photo-sensitive areas of a pixel that redirect light to the active photosites of the pixel.
- **Modified DSLR** - A DSLR with improved h-alpha response, either done through a third-party or DIY. This is accomplished by removing the existing chip cover glass (which is an aggressive cut filter by factor default) and either omitting it or replacing it with a less aggressive piece of class (to preserve autofocusing for terrestrial, daily use). Canon and Nikon produce astronomy-specific models that accomplish something similar, though most users would agree that they are still more restrictive around the 656.3 nm h-alpha line than a user-modified version.
- **NABG camera** - Meaning "Non-Anti-Blooming Gates" - A camera without pixel gates which will produce blooms once pixels become saturated. This retains linearity within an entire exposure, which is necessary for science applications such as photometry.
- **Noise** - Uncertainty in your data, resulting from various sources, such as "shot" noise, camera read noise, light-pollution noise, dark current noise, and quantization noise. It generally what we call the "bad stuff" in the image.
- **One-Shot Color Astro CCD** - A hybrid camera that uses a color filter array to shoot color in one-shot, yet also has astro CCD functionality, like on-board cooling and binning capabilities.
- **Pixel** - Meaning "Picture (PIX) ELement" - The smallest collection area of a light-collecting silicon chip. It's like a bucket for light.
- **Photon** - A particle of light, which a sensor converts to an electrical charge.
- **Photosite** - The portion of the pixel that collects light.
- **Pixel Gate** - The addition of a component onto each pixel that decreases pixel efficiency as it fills up. Doing so prevents full-pixels from spilling its charges into neighboring pixels, causing a cascading effect known as "blooming."
- **PRNU** - Meaning "Pixel Non-Response Uniformity" - Pixels are not always perfectly responsive relative to each other. Their rates of efficiency vary slightly at lower levels of saturation and increase problematically at higher levels of saturation. Typically not a problem for astro-imagers, but it can make for inaccurate photometric measurements at higher levels of pixel saturation.
- **Quantum Efficiency** - The ability of a CCD or CMOS chip to record light within given spectra. Depending on the chip, some light is more easily recorded than others. No spectra is ever recorded with 100% efficiency - there is always photonics "loss." Also known as the "sensitivity" of the chip.
- **Read-Out** - The act of transferring analog charges through the ADC to be counted into digital units.
- **RBI** - Meaning "Residual Bulk Imaging" - Some of the light within an image is the result of charges trapped in the silicon substrate itself, especially if those charges spilled out of over-saturated pixels. Although a camera sensor is designed to empty its pixel wells from exposure to exposure, this does not release those charges trapped outside the pixels. These residual charges can appears as "ghosting" in subsequent images, most notably in brighter areas of the previous image.
- **RBI Flashing** - Modern camera chips affected most by Residual Bulk Imaging or "ghosting" typically have an abatement process, called RBI "flooding," "clearing," or "pre-flashing." Regardless of the name, it typically involves flooding the silicon substrate with IR light prior to an image. This actually adds charges to the substrate somewhat uniformly to the entire chip, hiding brighter "ghosts" amidst a forest of now uniform substrate values. While RBI can also be reduced by operating a camera at warmer temperatures, or by waiting longer between images, IR flashing is typically an efficient strategy when RBI is very prominent after exposures of bright objects. It's not perfect, as the substrate doesn't accept IR light charges with perfect uniformity (often times silicon wafer machining marks can be seen after the flashing process). Thus, RBI flashing is a trade-off, in most cases.
- **RGB** - Meaning "Red, Green, and Blue" - An image with data taken though red, green and blue filters, either with full-chip filters (astro CCDs) or via a color filter array (DSLRs and one-shot-color astro CCDs).
- **Signal** - Accurate and certain data that comes from signal sources, like stars, planets, and deep space objects. Background sky glow and thermal "noise" are technically "signal" and are typically subtracted from an image. It can be thought of as the "good stuff" in an image.
- **Signal-to-Noise Ratio or S/N or SNR** - A ratio of good vs. bad, intended to measure the quality and efficient of data in an image. Better ratios are produced with greater apertures (more light per sky area), better atmospheric quality, more refined equipment/data recording, darker skies, and higher camera efficiency levels.
- **Spectral-band or Narrow-Band Filtering** - Using a thin band-pass filter to collect light from a specific emission of gas. Within CCD astronomy, Hydrogen-alpha or H-alpha (656.3nm), Oxygen-III (500.7nm and 495.9nm primary and secondary lines respectively), and Sulfur-II (672.4nm). Methane (890nm) is sometimes used when imaging Jupiter. Others can be used for specialty science. Band-pass widths are typically between 3 and 10 nm wide, with lower numbers being more expensive to produce and more capable of isolating a spectral-band signal. Incidentally, Nitrogen-II (658.4nm), being so near H-Alpha, is typically passed by the H-alpha filter, meaning that unless the filter has a small band-pass (around 3nm) then it is likely collecting Nitrogen data as well.
- **Spectral-band or Mapped-color Image** - An image uses only spectral-line filters for its data, either in a single spectrum (i.e. h-alpha only), dual-spectra (i.e. h-alpha and O-III), triple-spectra (Ha/OIII/SII), or other. Data is typically "mapped" to traditional RGB channels and blended according to a particular "palette."

</div>

As an example, with my SBIG STL-6303e camera, the KAF-6303E chip has a "full-well capacity" of approximately 100,000 electrons (e-). These electron charges are then converted to a range of brightness values called ADUs (analog to digital units), a task performed by the Analog/Digital Converter (ADC). The ADC, typically 16-bit in an astro CCD camera, takes this range of 100,000 electrons and assigns ADU values over the spread of 16-bits worth of values. As such, there are 65,536 values (16-bits worth) that will represent these electrons ***digitally***, or 1.5 electrons for each ADU value in an ideal case with the 6303E chip. That number, 1.5, would be the approximate gain for the camera. Note: The camera gain is actually 1.4...which is close enough for government work.

So how the ADC is utilized depends on how the camera is designed. Nothing says that you must use the entirety of the bit-depth of the ADC. An example of this would be my old SBIG ST-7E (KAF-0400 chip with anti-blooming), which had a camera gain of 2.3, meaning that it takes 2.3 electrons to make up one brightness level. So even though this camera had the potential for 16-bit output, in actuality, each pixel only exhibited short of 22,000 digital outputs (50,000e- full-well capacity divided by 2.3). Note: ADCs come in standard bit-depths in even numbers, such as 8-bit for an old webcam, 12-bit for an old DSLR, and 14 bit for a new DSLR. But because 14-bit is only 2^14th or 16,384 levels, SBIG needed a full 16-bit ADC to count those 22,000 electrons of pixel charges.

Doing so in this camera greatly under-utilizes the larger 16-bit ADC, however it trades off a certain amount dynamic range potential and a little quantization error (don't worry about that yet) in order to provide more headroom for the anti-blooming chip (don't worry about that yet either).

So, the 100th ADU (remember the "offset") - is total black and 22,000th ADU (approximately) is total white in that camera.

But regardless of the astro CCD camera, this gain factor is FIXED - there is just no good reason or need to set this by the user for such applications as astrophotography.

In the case of DSLRs, the gain is indeed user adjustable by changing the ISO (speed) settings. In such cameras, you can increase "speed" by raising the gain (higher ISO), thereby assigning multiple ADUs (or brightness levels) to a single electron value. Or, you can increase dynamic range by lowering the camera gain (smaller ISO), thereby assigning multiple electrons to the same ADU value. ***See [DSLRs and Unity Gain](/learning/dslrs-and-unity-gain/) for more on this topic.***

The entire ADC process is accomplished on-chip, meaning that once the images are opened in something like Photoshop, the brightness assignments have already been made.

*(Insert diagram of image histogram here)*

## CCD vs. CMOS

On any image sensor, this conversion of photons to electrons can take place in a couple of ways. For Charged-Coupled Devices (CCDs), the entire pixel is essentially a photosite. Once collected, these charges are then read-out horizontally (in parallel) like a "bucket brigade," being bused across the pixel row, one pixel at a time. The last column of pixels serves as a Serial Register, which collects on pixels worth of "shift," and pours them vertically down the chip's edge where they are dumped into an amplifier where they are counted, converted to a voltage, and then sent to the ADC where the array of voltages are assigned a digital value, which are, in turn, stored into memory.

<div class="ke-sidebar" data-side="right" data-width="wide">

## Sidebar: How Photons Become Electrons

In any digital camera, whether using CMOS or CCD technology (which deserves an article of its own), we can identify seven stages involved in turning light into digital data:

1. Charge generation
2. Charge collection and storage
3. Charge transfer
4. Charge measurement
5. Amplification
6. Analog to Digital Conversion
7. Digital On-camera processing & storage

Saving an in-depth study about these steps until another article, it's a least helpful to know some key points about each stage of the whole process.

In STAGE 1, electrons (negatively charged particles) can move if they become excited (or ionized). When this happens, an electron moves away from its "ground state" in an atom, becoming free to move. This "excited" state or "ionization" occurs when extra energy is added to it, which happens when the energy from a photon is added to an electron.

Therefore, ***each photon has the potential to liberate a single electron.*** This means that if we can somehow collect these electrons, then we will have a way to count the light photons that triggered the process. The entire process of "converting" photons into electrons is known as the ***photoelectric effect*** and at this stage the units to be counted are typically called ***photo-electrons***.

Of course, to be counted, photo-electrons must be stored. This is STAGE 2. Silicon alone has no ability to store an electron, even if the photon excites one of the four electrons of the silicon atom that have bound to each other forming its crystalline structure. But when the silicon is "doped" with boron or phosphorus, the elements bond together in a way that forms either a deficiency or a surplus of an electrons within each of the silicon types. Silicon doped with phosphorus (negatively charged "n-type" silicon) yields an excess electron (net negative charge) while boron doping (forming a positively charge "p-type silicon) yields a "hole" (net positive charge) that attracts any electron willing to fill it. When both types of doped silicon are adjacent to one another, the free electrons in the n-type silicon are free to move into the holes of the p-type silicon.

When a positive "bias" voltage is added electronically to the p-type silicon, the the photoelectric effect occurs, the newly freed electrons find themselves moving into the

Furthermore, y "biasing" with

Since those liberated electrons will always move toward the holes in the electron-starved areas of the silicon, they can be trapped and stored as long as there are enough "holes" to fill.

And second, the more silicon involved, the more charges (electrons) that can be collected. This means that larger pixels (more silicon), can hold more charges - which is why larger pixel cameras tend to have greater holding capacities per pixel.

</div>

To this point I have neglected to mention CMOS chips, though this should not be interpreted, on my part, as a lack of faith in the design. Simply put, CMOS technology, where it once lagged behind CCDs for low-light, long exposure applications has certainly bridged that gap over the last 5 years. Judging by the number of excellent astrophotos taken with CMOS-based DSLRs, the question of whether or not they can make a good astroimaging camera was answered some time ago.

***Producing Color***

So if you have three grayscale images taken with various filters (more on this in a minute), the computer processes each tri-color part (RGB) such that each pixel has 65,536 possible levels of brightness. Because the images are still grayscale, Photoshop knows to convert the red information to 65,536 possible levels of red, the blue information to 65,536 possible levels of blue, and the green information to 65,536 possible levels of green. (Photoshop only shows 256 or 8-bit on the screen, but it's actually a full 16-bit within that mode of operation). But until you place each image into the individual RGB color "channels," the images are just black and white pictures. You are simply inserting them into a "channel" of a color composition. When an image is pieced together in this fashion, it is termed an RGB image.

## Types of CCDs

There are three basic types of CCDs that are relevant to astroimaging.

1. "Full-Frame"
2. "Frame-transfer"
3. "Interline" transfer

**"Full-Frame"** is a type of CCD technology that derives its name from the way pixel-charges are read-out on the chip, namely, that once the recording of the data is complete, it reads out the entire chip at once.

At the end of the pixel rows, there is a single register of pixels that holds charges that are read-off. Charges are carried in parallel and held until all pixels are empty. Then, charges are carried in a serial fashion across the single register row to the amplifier. The familiar example is that of a "bucket brigade." From there, the charges are digitized by the ADC like any CCD.

Because pixels remain sensitive to light during the read-out phase, the camera must utilize a mechanical shutter. Therefore, in the event that images must be captured sequentially, as in a video camera, the frame rate is dependent on the physical speed of the shutter's movements. Similarly, because pixels are read-out across the chip in parallel, and then read-off in serial to the amplifier, actual read-out time takes longer than in other CCD technologies. In other words, "full-frame" transfer CCDs make a poor choice for video cameras and webcams, which require fast and sequential (no mechanical shutter) read-times.

The value of full-frame CCDs is that nearly 100% of the pixels can be utilized as photo-sites, since separate registers are utilized for the read-out and storage of individual charges - these components do not have to be on the pixels themselves. Thus, full-frame CCDs are generally more sensitive than other CCD types.

Dynamic range is generally better in full-frame CCDs as well. Because dynamic range is a ratio of full-well capacity (FWC) and camera read noise, and because FWC is directly proportional to pixel size (larger pixels naturally have larger holding capacities), full-frame CCDs are able to output a large number of shades of illumination (normally 14 to 15 bits), requiring 16-bit ADCs on chip.

The logical expression of full-frame CCDs is in single-shot, low-light applications, such as astroimaging, where read-out can occur after photon capture without penalty. Likewise, because of the higher-overall sensitivity and greater dynamic range, it has obvious advantages in the capture of faint targets.

**"Frame-Transfer"** is a technology similar to full-frame CCDs in that it too reads out the entire chip simultaneously. However, instead of utilizing a single register at the end of pixel rows, it sends pixel charges to a second, complete pixel. Therefore, one-half of a CCD chip is utilized for photon capture and the other half is used for read-out and storage. Therefore, frame-transfer CCDs require twice the amount of chip space in order to provide the same amount of capture area as the other CCD types, and that makes the cost of the chip rather excessive.

The application for frame-transfer CCDs is in video cameras with high frame-rates, where fast-performance is worth the higher costs. Likewise, they excel in low-light conditions since the photon-capture side of the chip is not hindered by on-pixel circuitry. However, practically speaking, they are not common in astroimaging applications. While they can be useful for video capture of solar system objects, interline chips are able to do the same job at less cost.

**"Interline"** transfer CCDs utilize rows of read-out registers alternating between the pixel rows themselves, allowing simultaneous acquisition of photon collection and read-out. Therefore, a mechanical shutter is not required. Likewise, upon read-out, charges only have to be sent to a neighboring pixel to find a register, not having to travel circuitously across the chip. This greatly enhances read-out speeds with less noise as compared to other CCD types. This makes interline transfer CCDs a logical choice for video cameras and webcams, where higher frame-rates are required.

Traditionally, because some pixels contain only read-out circuitry, there are fewer photo-sensitive areas as compared to other CCD-types, and that has made them pale in a head-to-head performance comparison to full-frame chips for long exposure astroimaging. However, due to the addition of *microlensing* technology, which overlays the read-out pixels with an opaque, photo-sensitive material and then channels collected photons to the photo-sites, much of the loss pixel space is redeemed for photon collection. Thus, modern interline chips are able to compete better with full-frame chips in sensitivity, at least enough to make them a viable choice.

The other advantage is that pixel sizes can be small with this technology, making them suitable for applications that require fine spatial detail.

The disadvantage is that those same small pixels provide less area to hold converted photons, meaning poorer full-well depths and, thus, less dynamic range as compared to full-frame CCDs.

## Chip "Sensitivity"

In discussing the many types of CCD chips available, the term "sensitivity" was used to refer to the ability of the chip to record photons. Essentially, the term is used to refer to the amount of photo-sensitive areas on a chip, and therefore, its ability to record photons. However, no CCD collects photons at a 100% success rate.

As discussed before, the reasons for conversion failure could be photons falling on not photo-sensitive areas of the chip, thereby going off into photon oblivion. Likewise, the angle that photons take to the chip is not always straight on. At some angles, photons will bounce instead of funnel into a pixel well. There is also the obvious issue with color filter arrays (i.e. Bayer matrix), whereas photons of certain colors are rejected entirely when they fall on pixels intended for other spectra.

In total, regardless of the number of pixels, or their size, CCD chips are rated for "sensitivity" with regard to how successful the chip records and then converts a photon to an electrical charge. It starts at a 100% success rate and falls off from there. This success rate is known as **Quantum Efficiency** or simply, **QE**.

Fast CCD chips, capable of recording 85% or more of the total photons that hit the chip, are normally of the "full-frame" variety, sometimes with a "back-illuminated" technology that increases the size of the photosites by thinning out the front-side of the chip, allowing some photons to be recorded by the back-side of the CCD. Other CCD chips, particularly interline chips, usually record light at a 50% rate or less. As mentioned previously, this is largely because such chips trade-off photo-sensitive areas for on-pixel, read-out componentry. However, compared to "full-frame" CCDs, the performance gap would be much worse without modern microlenses. Therefore, interline CCDs have bridged the performance gaps enough to make them suitable for a variety of applications, including serious astroimaging.

*(Chart of cameras and their QEs)*

Many people are under the mistaken notions that chips with bigger pixels will also be the most sensitive. While it is easier to increase with total number of photo-sensitive areas with bigger pixels - a fewer number of total pixels means less emphasis on read-out componentry -there are many small pixelled cameras capable of outperforming their large pixelled brethren. An example is the modest 6.8 micron Kodak KAF-3200 chip, found in the SBIG ST-10xme camera. Despite the fact that it is a full-frame chip, it still incorporates microlensing technology to increase photon yield. The result is a chip that yields 85% peak quantum efficiency and a wide spectral range, particularly at the hydrogen-alpha emission line (656.3nm). Only back-illuminated chips can outperform it in sensitivity, which normally achieve a 90% success rate, or more.

## Spectral Range

The problem with "quantum efficiency" as a measurement of CCD performance is the fact that it is measured at a peak wavelength where the chip is most sensitive. Because astronomical objects contain photons from the entirety of the CCD spectrum, going far beyond the normal human visual spectrum (more on this later), the important frequencies do not always match the peak efficiencies of the camera. This is especially true of the dominant hydrogen emissions found at the 656.3nm spectral line (h-alpha) found within emission nebulae. Therefore, if you plan to target these types of objects on a regular basis, knowing the QE of the chip at that spectral line is imperative.

For example, with the Kodak KAF-11000, a full 35mm-sized, interline chip found in the popular STL-11000M camera from Santa Barbara Instruments Group (SBIG), the 50% peak QE is enough to make the camera an excellent performer, and it contributes, in part, to the popularity of the chip. However, the chip falls off in performance in the red portion of the spectrum, having an efficiency of approximately 35% at the h-alpha spectral line. Compared to many popular full-frame astroimaging chips with peak quantum efficiencies actually AT that line, ranging from 60% (Kodak KAF-6303) to 85% (Kodak KAF-3200), the 11000 absorbs photons at half the rate, or worse. While this does not prohibit astronomers from imaging at the h-alpha line - many fine h-alpha images have been achieved with the KAF-11000 chip - there are simply better choices for those who make spectral-line imaging a large part of their imaging "program."

*(insert CCD spectral curves and h-alpha images here)*

Similarly, for those who wish to make photometric measurements with their cameras using UBVRI filters, they will want cameras with higher sensitivities to the ultraviolet (U-filter) and near-infrared (I-filter) parts of the spectrum. Forgetting the fact that there are *anti-blooming gates* (see next section) on the KAF-11000m chip, the camera falls off so dramatically before the near-infrared spectrum (above 700nm) that it makes the camera a poor choice for this type of application.

Conversely, since the 50% peak efficiency of the 11000 chip falls near the 400nm spectral line, it will compete very well against full-frame CCDs for objects that are predominantly blue. Therefore, as somebody who captures something OTHER than emission sources, the 11000 camera might be all that is needed; or, in the least, it might make a weaker h-alpha response an acceptable trade-off. Once again, judging by the popularity of this chip, there is much truth in this statement.

Therefore, choosing a CCD camera based on quantum efficiency requires a careful balance of other issues as well. Spectral range is a major consideration with any camera choice.

## Blooming vs. Anti-blooming (NABG vs. ABG)

Yet another important consideration in choosing a CCD camera concerns your desire to allow or completely suppress "blooms." "Blooming" is the occurrence of cascade-streaking in an image after over-saturation of a pixel. When a pixel reaches full-well capacity (FWC), a CCD chip will not contain the surplus electrical charges. Instead, the pixel charges spill over (cascade) into neighboring pixels, streaking down the pixel rows until the charges find a pixel-well in which they can finally reside.

*Figure 1 - Blooming is a dynamic of astronomical CCD chips where information spills from one pixel to the next and cascades down the columns of the array. This appears as spikes on the bright stars of an image, as in this unprocessed frame of the Rosette nebula.*

Prior to further processing, the blooms have to be fixed by using either the Clone tool in Photoshop or a "de-blooming" tool in your favorite astronomical imaging processing software package.

Aside from bloom clean-up, "non-anti-blooming" (NABG) cameras do have their negatives. First, longer exposures and bright stars can cause severe blooms, such as in this shot of M42, also a 5 minute, RAW, red channel exposure:

These blooms are much harder to clean. But not only that, any information beneath the blooms are lost permanently.

Second, because blooming is likely to occur, you are somewhat limited on the length of exposures you can make. Even though your skies might allow for 10 minute shots, the camera will prevent you from anything longer than a few minutes if the composition contains bright stars and objects. In fact, some objects, like the Pleiades cannot be shot at all with these cameras. That's because these objects are rich with bright stars. In order to get faint details, you'd have to expose the image to point of severe blooming of the bright stars.

"Anti-blooming" does exist as an option in many of the cameras, which all but eliminates blooms from even the brightest of objects, but they do this at the cost of sensitivity and dynamic range. NABG cameras (without anti-blooming technology) hold twice as many photons per pixel and are more sensitive than their ABG brethren. Practically speaking, this equates to 30% less exposure time for NABG cameras than ABG cameras, which is why people buy cameras without the anti-blooming technology - maximum signal is important to them.

The negatives regarding non-antiblooming cameras (NABG) is that even though exposure requirements are 30% less than that of an ABG camera, that time is more than made up for in a.) processing the blooms and b.) having to stack more images.

We can look at this by studying the approach you are likely to take with both camera types. Let's say we are going to take a grayscale image of the aforementioned Rosette Nebula. With the NABG camera, we'd probably plan out three, 10 minute exposures - 30 minutes of total exposure time. Any more than this and we'd lose information to blooming. If we were doing the same image with an ABG camera, we'd need approximately 40 minutes of total image time to get the same level of signal as with the NABG image; however, because we can take longer exposures, we can take the image with either two, 20 minute shots, or even a single, 40 minute shot, depending on the sky darkness.

So, you'd need an extra 10 minutes with the ABG camera to give the same amount of detail as with the NABG camera. However, shorter exposures require extra processing time in fixing the blooms, not to mention the extra time required with simply stacking more images. With large resolution CCD cameras with 11 megapixel or larger, each extra sub-frame can really drag down a computer's performance.

The other aspect of this process that requires more time is that you normally have to wait a minute between individual exposures so that the guide star can settle down and you can begin the new exposure. Of course, this isn't a problem if you are guiding with a separate guider. SBIG cameras often have two chips, one for imaging and a smaller one for guiding. So, when the shutter is closed between exposures, the guidestar is temporarily lost. The software allows you to establish some amount of time to reacquire the guidestar prior to beginning the next image. Though the time isn't much (about 10 seconds), it still contributes to the extra time.

In summary, NABG cameras allow for maximum signal gain of very faint objects in the least amount of time. While ABG cameras are slower, they make up for this time in processing. Plus, I find ABG cameras to be much more fun to use, without the worries of information loss due to blooms.
