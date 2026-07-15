---
title: Do I Need PixInsight? A quick answer...
description: Weighing PixInsight against Photoshop for astrophotography processing workflows.
pubDate: 2020-01-08
draft: false
---

PixInsight is an all-in-one solution...and if you learn it completely there's no doubt that you will have the best of everything...but that's the problem...you can spend a lifetime and not really "get" PixInsight. Honestly, it's terrible software from a usability standpoint...but if you approach it from ONE processing module at a time, then you can begin to harness its power. For example, I use the following PixInsight processes, which I've incorporated one at a time over the years...

- ImageCalibration, StarAlignment, DrizzleIntegration, Debayer, and ImageIntegration for stacking stages.
- HistogramTransformation, HDRMultiscaleTransform, and LocalHistogramEqualization for stretching stages.
- MultiscaleLinearTransform and MultiscaleMedianTransform for noise reduction.
- DynamicCrop and DynamicBackgroundExtraction for cropping and gradient removal.
- ChannelCombination and LRGBCombination for channel merges.

There are other processes I'll use when the situation requires it, such as SCNR (green color removal), LarsonSekanina (for comets and solar images), CosmeticCorrection (for residual outlier noise), DynamicPSF/Deconvolution (for sharpening), MorphologicalTransformation (for smaller stars), PixelMath (for a variety of things), and ColorSaturation.

If you don't tackle processes one at a time from a learning standpoint, you'll truly be overwhelmed...and thus it's usually better to learn everything outside of PixInsight first, so you know what a proper workflow and processing theory looks like, and then explore PixInsight tools as replacements later. This is, of course, my opinion.

But for me, knowing Photoshop (PS) so well, it's sorta irreplaceable for many things, especially for processes that require masks or any localized (as opposed to global) image processes (stretches, convolutions, and deconvolutions). It's just so much easier in PS...there is power in the simplicity. And I also use a lot of ProDigital Photoshop Actions, which I find quite powerful if used correctly.

The one thing that PI does that you can't in PS is that you can process data while it's still linear...a process like MultiscaleLinearTransform allows noise reduction at the linear stage (important) and DrizzleIntegration allows recovery of resolution in undersampled images at the linear stage (powerful). Processing in 32-bits is also important, something you can't do completely in PS.

Additionally, PI lets you reduce and stack your data...so it does replace your typical stacking software as well. PixInsight replaced CCDstack in my workflow completely...and from the standpoint of "doing everything" if you want, PI is a very good value.

It does seem like there's a "you must own PixInsight" message out there today. Whether that message is getting communicated directly from its users or if it's just the momentum of the PI train, I'm not sure. But it does bother me...PS is just so powerful and it's a shame that beginners are getting the idea that it might be replaceable...you REALLY have to know PI for that to happen. Even so, MANY of the world's best imagers still don't use PixInsight, most notably Rob Gendler.

For me, Photoshop is MUCH more intuitive...which yields more power, especially for post-processing, channel merges, masking effects, etc. That's the power of layers.

In truth, BOTH software has great utility and value. But if I were to recommend a route for MOST beginners to take, Photoshop would be my most indispensable choice.
