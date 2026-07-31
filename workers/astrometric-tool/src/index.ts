export interface Env {
  ASTROMETRY_API_KEY: string;
}

const ASTROMETRY_API = 'https://nova.astrometry.net/api';
const ASTROMETRY_WCS_URL = 'https://nova.astrometry.net/wcs_file';
const SIMBAD_TAP = 'https://simbad.cds.unistra.fr/simbad/sim-tap/sync';

const ALLOWED_ORIGINS = new Set([
  'https://allaboutastro.com',
  'http://localhost:4321',
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_RADIUS_DEG = 5;
const MAX_MAG_LIMIT = 18;

// SIMBAD's `otype` column is a leaf code in a hierarchy (exposed via its
// own `otypedef` table, with a `path` column like "G > AGN > SyG > Sy2").
// A plain `otype = 'G'` filter (what an earlier version of this file used)
// only matches objects classified as the generic base type and misses
// everything filed under a more specific descendant -- e.g. M31 itself is
// classified 'AGN', not 'G', so it would silently never match. Filtering
// via `otype IN (SELECT otype FROM otypedef WHERE path = 'G' OR path LIKE
// 'G >%')` matches the whole branch instead. Same reasoning for `stars`:
// rather than leaving otype unfiltered (which let bright cataloged
// galaxies/AGN with real V-band photometry -- again, M31 -- leak into the
// "stars" category and get labeled with the object's own name), require
// membership in the '*' (star) branch. Verified against live SIMBAD data
// 2026-07-31: 'GlC'/'OpC' (globular/open cluster) are leaf codes with no
// further descendants, so an exact match is correct for those as-is.
// Verified live against SIMBAD 2026-07-31/08-01. `otype` is a leaf code in
// a hierarchy exposed via SIMBAD's own `otypedef` table (`path` column,
// e.g. "G > AGN > SyG > Sy2") -- filtering on an exact leaf otype like
// 'G' misses every more-specific descendant (M31 itself is 'AGN', not
// 'G'). Where a category maps to a whole branch (stars, galaxies) filter
// via `otype IN (SELECT otype FROM otypedef WHERE path ...)`; where it's
// a single leaf with no descendants (GlC, OpC, HII, RNe) an exact match
// is correct and confirmed as such.
//
// `catalogClause` restricts results to objects with a real identifier in
// specific catalogs, via a JOIN against SIMBAD's `ident` table (aliases,
// not just the primary main_id). Requested for HII regions/reflection
// nebulae specifically to avoid flooding those sliders with obscure
// survey-only designations that mean nothing to a casual viewer; the
// catalog-only categories (messier/ngc/ic/barnard) use catalogClause
// alone with no *positive* otype restriction, on purpose -- the whole
// point of a catalog slider is showing "every kind of object in catalog
// X", not one object type. Confirmed live identifier formats: Messier
// "M   4", NGC "NGC  6144", IC "IC    2", Sharpless "SH  2-9" (both Sh1
// and Sh2 sub-catalogs share the "SH " prefix), Barnard dark nebulae
// "Barnard  18".
//
// NGC/IC are large general-purpose catalogs that also number individual
// stars *within* a cluster as sub-entries (e.g. a globular cluster's own
// member RR Lyrae variables get "NGC 6121 ###"-style designations) --
// confirmed live within M4's own field: querying "NGC %" turned up 1 real
// cluster (M4/NGC 6121 itself) plus 231 individual member stars. Since
// stars already have their own dedicated slider, NGC/IC explicitly
// exclude the star branch so the catalog slider shows only the cataloged
// object itself, not everything numbered underneath it.
const MAJOR_CATALOG_CLAUSE = `(i.id LIKE 'M %' OR i.id LIKE 'NGC %' OR i.id LIKE 'IC %' OR i.id LIKE 'SH %')`;
const EXCLUDE_STARS_CLAUSE = `b.otype NOT IN (SELECT otype FROM otypedef WHERE path LIKE '*%')`;

// Herschel 400 and Herschel II are amateur-astronomy observing-list
// curations (compiled by the Astronomical League and, originally, the
// Rose City Astronomers), not catalogs with their own identifiers in
// SIMBAD -- confirmed live 2026-08-01 that SIMBAD's `ident` table has
// zero entries for any "Herschel"/"H400"-style prefix. Their complete,
// real membership lists (400 NGC numbers each) were instead sourced
// directly from the Astronomical League's own official PDFs: "The
// Herschel 400 Club Observing List in NGC Number Order"
// (astroleague.org/wp-content/uploads/2022/02/h400lstn.pdf) and the
// Herschel II NGC-ordered list
// (astroleague.org/wp-content/uploads/2022/02/H2-Lists-2020-NGC.pdf).
// Both lists are NGC-only (no IC objects), matching the source PDFs.
const HERSCHEL_400_LIST = [
  40, 129, 136, 157, 185, 205, 225, 246, 247, 253, 278, 288, 381, 404, 436, 457, 488, 524, 559, 584, 596, 598, 613,
  615, 637, 651, 654, 659, 663, 720, 752, 772, 779, 869, 884, 891, 908, 936, 1022, 1023, 1027, 1052, 1055, 1084,
  1245, 1342, 1407, 1444, 1501, 1502, 1513, 1528, 1535, 1545, 1647, 1664, 1788, 1817, 1857, 1907, 1931, 1961, 1964,
  1980, 1999, 2022, 2024, 2126, 2129, 2158, 2169, 2185, 2186, 2194, 2204, 2215, 2232, 2244, 2251, 2264, 2266, 2281,
  2286, 2301, 2304, 2311, 2324, 2335, 2343, 2353, 2354, 2355, 2360, 2362, 2371, 2372, 2392, 2395, 2403, 2419, 2420,
  2421, 2422, 2423, 2438, 2440, 2479, 2482, 2489, 2506, 2509, 2527, 2539, 2548, 2567, 2571, 2613, 2627, 2655, 2681,
  2683, 2742, 2768, 2775, 2782, 2787, 2811, 2841, 2859, 2903, 2950, 2964, 2974, 2976, 2985, 3034, 3077, 3079, 3115,
  3147, 3166, 3169, 3184, 3190, 3193, 3198, 3226, 3227, 3242, 3245, 3277, 3294, 3310, 3344, 3377, 3379, 3384, 3395,
  3412, 3414, 3432, 3486, 3489, 3504, 3521, 3556, 3593, 3607, 3608, 3610, 3613, 3619, 3621, 3626, 3628, 3631, 3640,
  3655, 3665, 3675, 3686, 3726, 3729, 3810, 3813, 3877, 3893, 3898, 3900, 3912, 3938, 3941, 3945, 3949, 3953, 3962,
  3982, 3992, 3998, 4026, 4027, 4030, 4036, 4038, 4041, 4051, 4085, 4088, 4102, 4111, 4143, 4147, 4150, 4151, 4179,
  4203, 4214, 4216, 4245, 4251, 4258, 4261, 4273, 4274, 4278, 4281, 4293, 4303, 4314, 4346, 4350, 4361, 4365, 4371,
  4394, 4414, 4419, 4429, 4435, 4438, 4442, 4448, 4449, 4450, 4459, 4473, 4477, 4478, 4485, 4490, 4494, 4526, 4527,
  4535, 4536, 4546, 4548, 4550, 4559, 4565, 4570, 4594, 4596, 4618, 4631, 4636, 4643, 4654, 4656, 4660, 4665, 4666,
  4689, 4697, 4698, 4699, 4725, 4753, 4754, 4762, 4781, 4800, 4845, 4856, 4866, 4900, 4958, 4995, 5005, 5033, 5054,
  5195, 5248, 5273, 5322, 5363, 5364, 5466, 5473, 5474, 5557, 5566, 5576, 5631, 5634, 5676, 5689, 5694, 5746, 5846,
  5866, 5897, 5907, 5982, 6118, 6144, 6171, 6207, 6217, 6229, 6235, 6284, 6287, 6293, 6304, 6316, 6342, 6355, 6356,
  6369, 6401, 6426, 6440, 6445, 6451, 6514, 6517, 6520, 6522, 6528, 6540, 6543, 6544, 6553, 6568, 6569, 6583, 6624,
  6629, 6633, 6638, 6642, 6645, 6664, 6712, 6755, 6756, 6781, 6802, 6818, 6823, 6826, 6830, 6834, 6866, 6882, 6885,
  6905, 6910, 6934, 6939, 6940, 6946, 7000, 7006, 7008, 7009, 7044, 7062, 7086, 7128, 7142, 7160, 7209, 7217, 7243,
  7296, 7331, 7380, 7448, 7479, 7510, 7606, 7662, 7686, 7723, 7727, 7789, 7790, 7814,
];
const HERSCHEL_400_NGC = new Set(HERSCHEL_400_LIST);
// Not an "official" published per-object ordinal (the Astronomical
// League's list isn't numbered 1-400 anywhere) -- this is this array's
// own position, used only to give each match a "#N of 400" reference
// point on its label, per Jay's request to show a list position alongside
// the object's real name.
const HERSCHEL_400_ORDINAL = new Map(HERSCHEL_400_LIST.map((n, i) => [n, i + 1]));

const HERSCHEL_II_LIST = [
  23, 24, 125, 151, 175, 198, 206, 214, 217, 315, 337, 357, 410, 428, 499, 513, 514, 604, 636, 660, 665, 672, 706,
  718, 741, 821, 890, 896, 925, 991, 1003, 1012, 1032, 1035, 1045, 1058, 1060, 1070, 1073, 1087, 1090, 1114, 1156,
  1161, 1162, 1169, 1172, 1175, 1184, 1187, 1193, 1199, 1207, 1209, 1325, 1332, 1348, 1353, 1400, 1421, 1491, 1507,
  1514, 1579, 1582, 1587, 1600, 1605, 1618, 1624, 1637, 1662, 1663, 1700, 1762, 1778, 1779, 1832, 1883, 1977, 1985,
  2023, 2071, 2112, 2139, 2170, 2182, 2192, 2196, 2236, 2245, 2252, 2254, 2259, 2261, 2269, 2274, 2283, 2302, 2309,
  2316, 2331, 2339, 2346, 2347, 2359, 2366, 2367, 2374, 2396, 2414, 2415, 2432, 2467, 2493, 2500, 2525, 2541, 2610,
  2639, 2756, 2765, 2781, 2784, 2805, 2855, 2880, 2889, 2986, 3065, 3067, 3073, 3078, 3107, 3145, 3156, 3158, 3162,
  3177, 3225, 3254, 3274, 3301, 3319, 3338, 3359, 3424, 3430, 3507, 3511, 3513, 3516, 3524, 3547, 3583, 3585, 3596,
  3599, 3605, 3611, 3622, 3636, 3637, 3642, 3646, 3652, 3659, 3666, 3668, 3669, 3672, 3681, 3682, 3683, 3689, 3693,
  3705, 3732, 3756, 3887, 3892, 4013, 4024, 4039, 4045, 4047, 4062, 4073, 4096, 4100, 4105, 4124, 4133, 4136, 4138,
  4144, 4152, 4157, 4168, 4169, 4185, 4189, 4212, 4217, 4220, 4224, 4233, 4235, 4236, 4237, 4241, 4244, 4248, 4250,
  4256, 4260, 4264, 4267, 4270, 4271, 4290, 4291, 4294, 4298, 4299, 4302, 4310, 4312, 4313, 4319, 4336, 4339, 4340,
  4343, 4359, 4369, 4379, 4395, 4487, 4517, 4519, 4571, 4586, 4605, 4608, 4612, 4639, 4647, 4691, 4742, 4880, 4902,
  4904, 4914, 4915, 4928, 4939, 4941, 4956, 4981, 4984, 4999, 5012, 5018, 5020, 5023, 5037, 5044, 5053, 5056, 5061,
  5068, 5077, 5078, 5084, 5087, 5103, 5129, 5134, 5204, 5308, 5371, 5383, 5426, 5430, 5440, 5443, 5444, 5445, 5447,
  5448, 5462, 5480, 5481, 5485, 5490, 5493, 5506, 5507, 5520, 5523, 5529, 5533, 5548, 5560, 5582, 5585, 5590, 5595,
  5597, 5600, 5602, 5605, 5638, 5660, 5668, 5687, 5728, 5750, 5775, 5791, 5806, 5812, 5813, 5831, 5838, 5850, 5854,
  5861, 5864, 5878, 5879, 5899, 5970, 5985, 6015, 6058, 6070, 6106, 6155, 6166, 6181, 6239, 6340, 6507, 6526, 6548,
  6596, 6604, 6717, 6772, 6793, 6800, 6804, 6814, 6824, 6857, 6888, 6894, 6907, 6960, 6991, 6992, 6997, 7023, 7031,
  7042, 7067, 7082, 7129, 7139, 7156, 7171, 7177, 7184, 7218, 7245, 7332, 7354, 7377, 7392, 7419, 7457, 7463, 7465,
  7492, 7507, 7541, 7562, 7600, 7619, 7623, 7626, 7635, 7640, 7742, 7762, 7785, 7814, 7832,
];
const HERSCHEL_II_NGC = new Set(HERSCHEL_II_LIST);
const HERSCHEL_II_ORDINAL = new Map(HERSCHEL_II_LIST.map((n, i) => [n, i + 1]));

// Caldwell catalogue (Patrick Moore, 109 objects). Sourced from Wikipedia's
// "Caldwell catalogue" table 2026-08-01 and spot-checked against known
// objects (C1=NGC 188, C57=NGC 6822/Barnard's Galaxy, C77=NGC 5128/
// Centaurus A, C92=NGC 3372/Carina Nebula, C106=NGC 104/47 Tucanae all
// confirmed correct). Like Herschel 400/II, Caldwell itself has no SIMBAD
// identifier -- matched here via the NGC/IC numbers of its member objects
// instead. Three of the 109 (C9, C41, C99) aren't NGC/IC objects at all;
// those are matched by exact SIMBAD ident instead (verified live: Sh2-155
// -> "SH  2-155", the Hyades -> "Cl Melotte   25", the Coalsack -> "NAME
// Coalsack Nebula"). C14 (the Double Cluster) is two NGC objects, both
// included. Kept as one explicit [C#, prefix, designation] list (rather
// than separate membership sets) so the real published C-number can be
// attached to each match's label, not just yes/no membership.
const CALDWELL_ENTRIES: [number, 'NGC' | 'IC' | 'OTHER', number | string][] = [
  [1, 'NGC', 188], [2, 'NGC', 40], [3, 'NGC', 4236], [4, 'NGC', 7023], [5, 'IC', 342], [6, 'NGC', 6543],
  [7, 'NGC', 2403], [8, 'NGC', 559], [9, 'OTHER', 'SH 2-155'], [10, 'NGC', 663], [11, 'NGC', 7635],
  [12, 'NGC', 6946], [13, 'NGC', 457], [14, 'NGC', 869], [14, 'NGC', 884], [15, 'NGC', 6826], [16, 'NGC', 7243],
  [17, 'NGC', 147], [18, 'NGC', 185], [19, 'IC', 5146], [20, 'NGC', 7000], [21, 'NGC', 4449], [22, 'NGC', 7662],
  [23, 'NGC', 891], [24, 'NGC', 1275], [25, 'NGC', 2419], [26, 'NGC', 4244], [27, 'NGC', 6888], [28, 'NGC', 752],
  [29, 'NGC', 5005], [30, 'NGC', 7331], [31, 'IC', 405], [32, 'NGC', 4631], [33, 'NGC', 6992], [34, 'NGC', 6960],
  [35, 'NGC', 4889], [36, 'NGC', 4559], [37, 'NGC', 6885], [38, 'NGC', 4565], [39, 'NGC', 2392], [40, 'NGC', 3626],
  [41, 'OTHER', 'Cl Melotte 25'], [42, 'NGC', 7006], [43, 'NGC', 7814], [44, 'NGC', 7479], [45, 'NGC', 5248],
  [46, 'NGC', 2261], [47, 'NGC', 6934], [48, 'NGC', 2775], [49, 'NGC', 2237], [50, 'NGC', 2244], [51, 'IC', 1613],
  [52, 'NGC', 4697], [53, 'NGC', 3115], [54, 'NGC', 2506], [55, 'NGC', 7009], [56, 'NGC', 246], [57, 'NGC', 6822],
  [58, 'NGC', 2360], [59, 'NGC', 3242], [60, 'NGC', 4038], [61, 'NGC', 4039], [62, 'NGC', 247], [63, 'NGC', 7293],
  [64, 'NGC', 2362], [65, 'NGC', 253], [66, 'NGC', 5694], [67, 'NGC', 1097], [68, 'NGC', 6729], [69, 'NGC', 6302],
  [70, 'NGC', 300], [71, 'NGC', 2477], [72, 'NGC', 55], [73, 'NGC', 1851], [74, 'NGC', 3132], [75, 'NGC', 6124],
  [76, 'NGC', 6231], [77, 'NGC', 5128], [78, 'NGC', 6541], [79, 'NGC', 3201], [80, 'NGC', 5139], [81, 'NGC', 6352],
  [82, 'NGC', 6193], [83, 'NGC', 4945], [84, 'NGC', 5286], [85, 'IC', 2391], [86, 'NGC', 6397], [87, 'NGC', 1261],
  [88, 'NGC', 5823], [89, 'NGC', 6087], [90, 'NGC', 2867], [91, 'NGC', 3532], [92, 'NGC', 3372], [93, 'NGC', 6752],
  [94, 'NGC', 4755], [95, 'NGC', 6025], [96, 'NGC', 2516], [97, 'NGC', 3766], [98, 'NGC', 4609],
  [99, 'OTHER', 'NAME Coalsack Nebula'], [100, 'IC', 2944], [101, 'NGC', 6744], [102, 'IC', 2602],
  [103, 'NGC', 2070], [104, 'NGC', 362], [105, 'NGC', 4833], [106, 'NGC', 104], [107, 'NGC', 6101],
  [108, 'NGC', 4372], [109, 'NGC', 3195],
];
const CALDWELL_NGC = new Set(CALDWELL_ENTRIES.filter((e) => e[1] === 'NGC').map((e) => e[2] as number));
const CALDWELL_IC = new Set(CALDWELL_ENTRIES.filter((e) => e[1] === 'IC').map((e) => e[2] as number));
const CALDWELL_NUMBER_BY_NGC = new Map(CALDWELL_ENTRIES.filter((e) => e[1] === 'NGC').map((e) => [e[2] as number, e[0]]));
const CALDWELL_NUMBER_BY_IC = new Map(CALDWELL_ENTRIES.filter((e) => e[1] === 'IC').map((e) => [e[2] as number, e[0]]));
const CALDWELL_NUMBER_BY_EXTRA = new Map(CALDWELL_ENTRIES.filter((e) => e[1] === 'OTHER').map((e) => [e[2] as string, e[0]]));
const CALDWELL_EXTRA_CLAUSE = `i.id IN ('SH  2-155', 'Cl Melotte   25', 'NAME Coalsack Nebula')`;
const CALDWELL_EXTRA_NAMES = new Set(['SH 2-155', 'Cl Melotte 25', 'NAME Coalsack Nebula']);

// Attaches a "list position" label to a match, per Jay's request to show
// the object's number in the list alongside its real designation --
// returns null for categories where this doesn't apply.
function listNumberOf(category: string, name: string): string | null {
  if (category === 'herschel400' || category === 'herschel2') {
    const c = isCleanNgcOrIc(name);
    if (!c || c.prefix !== 'NGC') return null;
    const ordinal = (category === 'herschel400' ? HERSCHEL_400_ORDINAL : HERSCHEL_II_ORDINAL).get(c.num);
    return ordinal ? `#${ordinal} of 400` : null;
  }
  if (category === 'caldwell') {
    const c = isCleanNgcOrIc(name);
    if (c) {
      const n = c.prefix === 'NGC' ? CALDWELL_NUMBER_BY_NGC.get(c.num) : CALDWELL_NUMBER_BY_IC.get(c.num);
      return n ? `C${n}` : null;
    }
    const n = CALDWELL_NUMBER_BY_EXTRA.get(name);
    return n ? `C${n}` : null;
  }
  return null;
}

// Anchored at both ends -- NGC/IC catalog numbers are also informally
// reused as a prefix for objects/features *within* the parent object
// (star sub-designations like "NGC 6121 27", component suffixes like
// "NGC 660A"/"NGC 660B", X-ray sources like "NGC 104 125"). A loose
// `^NGC\s*(\d+)` match treats all of those as the plain parent number --
// confirmed live: "NGC 660A"/"NGC 660B" (components of one real Herschel
// II object) and four "NGC 104 ###" X-ray sub-sources inside 47 Tucanae
// (an X-ray point source isn't excluded by EXCLUDE_STARS_CLAUSE, which
// only excludes the star branch) both slipped through before this was
// anchored. Requiring nothing after the digits rejects all of these.
function isCleanNgcOrIc(name: string): { prefix: 'NGC' | 'IC'; num: number } | null {
  const m = /^(NGC|IC)\s*(\d+)$/.exec(name);
  return m ? { prefix: m[1] as 'NGC' | 'IC', num: Number(m[2]) } : null;
}
function isHerschel400(name: string): boolean {
  const c = isCleanNgcOrIc(name);
  return !!c && c.prefix === 'NGC' && HERSCHEL_400_NGC.has(c.num);
}
function isHerschelII(name: string): boolean {
  const c = isCleanNgcOrIc(name);
  return !!c && c.prefix === 'NGC' && HERSCHEL_II_NGC.has(c.num);
}
function isCaldwell(name: string): boolean {
  const c = isCleanNgcOrIc(name);
  if (c) return c.prefix === 'NGC' ? CALDWELL_NGC.has(c.num) : CALDWELL_IC.has(c.num);
  return CALDWELL_EXTRA_NAMES.has(name);
}
// e.g. "17 Tau", "5 Vul" -- digits, space, exactly a 3-letter IAU
// constellation abbreviation (mixed-case: "CMa", "CVn", "UMa" all have a
// capital mid-word, so this can't assume simple title-case).
function isFlamsteedShaped(name: string): boolean {
  return /^\d+\s+[A-Za-z]{3}$/.test(name);
}
// SIMBAD's Greek-letter (Bayer) designations share the same generic '* '
// alias prefix as Flamsteed numbers and other star aliases (confirmed live
// 2026-08-01: Sirius's full alias list has it as plain "*  alf CMa", no
// distinct "Bayer" prefix to filter on) -- so, like Flamsteed, it's matched
// by ident *shape* after the same '* ' JOIN: a Greek-letter abbreviation
// (optionally with a trailing component digit for shared-letter systems,
// e.g. "alf01 Cap"/"alf02 Cap") followed by a 3-letter constellation code.
const GREEK_ABBR = new Set([
  'alf', 'bet', 'gam', 'del', 'eps', 'zet', 'eta', 'the', 'iot', 'kap',
  'lam', 'mu.', 'nu.', 'xi.', 'omi', 'pi.', 'rho', 'sig', 'tau', 'ups',
  'phi', 'chi', 'psi', 'ome',
]);
function isBayerShaped(name: string): boolean {
  const m = /^([A-Za-z.]{3})\d{0,2}\s+[A-Za-z]{3}$/.exec(name);
  return !!m && GREEK_ABBR.has(m[1].toLowerCase());
}
function isCleanBd(name: string): boolean {
  return /^BD[+-]\d+\s+\d+$/.test(name);
}

interface CategoryDef {
  otypeClause?: string;
  catalogClause?: string;
  // Post-query filter applied after grouping, for categories whose
  // membership isn't expressible as a SIMBAD identifier pattern (static
  // observing-list curations matched by NGC/IC number instead).
  membershipFilter?: (name: string) => boolean;
}

const CATEGORY_DEFS: Record<string, CategoryDef> = {
  stars: { otypeClause: `b.otype IN (SELECT otype FROM otypedef WHERE path LIKE '*%')` },
  galaxies: { otypeClause: `b.otype IN (SELECT otype FROM otypedef WHERE path = 'G' OR path LIKE 'G >%')` },
  globular: { otypeClause: `b.otype = 'GlC'` },
  open: { otypeClause: `b.otype = 'OpC'` },
  hii: { otypeClause: `b.otype = 'HII'`, catalogClause: MAJOR_CATALOG_CLAUSE },
  // 'RNe' (reflection nebula) is a child of the more generic 'GNe'
  // (gaseous nebula) in SIMBAD's hierarchy -- confirmed live that SIMBAD
  // classifies well-known, named reflection nebulae under the *generic*
  // parent code rather than the specific child: IC 4603/4604/4605 (the
  // famous Rho Ophiuchi reflection nebulae) are all 'GNe', not 'RNe'. An
  // exact 'RNe' match missed them entirely. Matching the whole branch
  // (same fix pattern as galaxies/stars above) catches both.
  reflection: {
    otypeClause: `b.otype IN (SELECT otype FROM otypedef WHERE path = 'ISM > Cld > GNe' OR path LIKE 'ISM > Cld > GNe >%')`,
    catalogClause: MAJOR_CATALOG_CLAUSE,
  },
  messier: { catalogClause: `i.id LIKE 'M %'` },
  ngc: { otypeClause: EXCLUDE_STARS_CLAUSE, catalogClause: `i.id LIKE 'NGC %'`, membershipFilter: (n) => !!isCleanNgcOrIc(n) },
  ic: { otypeClause: EXCLUDE_STARS_CLAUSE, catalogClause: `i.id LIKE 'IC %'`, membershipFilter: (n) => !!isCleanNgcOrIc(n) },
  barnard: { catalogClause: `i.id LIKE 'Barnard %'` },
  // Halton Arp's "Atlas of Peculiar Galaxies" is catalogued in SIMBAD
  // under the prefix "APG" ("Atlas of Peculiar Galaxies"), not "Arp" --
  // confirmed live via a known object (Arp 220 resolves to ident
  // "APG 220"; M32 itself, a real Arp-catalog companion galaxy of M31,
  // is found via "APG 168"). Renamed back to "Arp NNN" for display since
  // that's the name anyone would actually recognize.
  arp: { catalogClause: `i.id LIKE 'APG %'` },
  herschel400: {
    otypeClause: EXCLUDE_STARS_CLAUSE,
    catalogClause: `i.id LIKE 'NGC %'`,
    membershipFilter: isHerschel400,
  },
  herschel2: {
    otypeClause: EXCLUDE_STARS_CLAUSE,
    catalogClause: `i.id LIKE 'NGC %'`,
    membershipFilter: isHerschelII,
  },
  caldwell: {
    otypeClause: EXCLUDE_STARS_CLAUSE,
    catalogClause: `(i.id LIKE 'NGC %' OR i.id LIKE 'IC %' OR ${CALDWELL_EXTRA_CLAUSE})`,
    membershipFilter: isCaldwell,
  },
  // Star catalogs. WDS/HIP/SAO/WD/BD each have a literal, unambiguous
  // ident prefix (verified live 2026-08-01: "WDS J...", "HIP N", "SAO N",
  // "WD hhmm+dd", "BD+dd N"/"BD-dd N") so they use the same clean
  // LIKE-prefix approach as the other single-catalog categories.
  // Bayer and Flamsteed are different: SIMBAD stores both under the
  // generic '*' (star) alias prefix shared with variable-star names, etc.
  // (confirmed live: 17 Tau's full alias list has it as plain "*  17 Tau",
  // no distinct "Flamsteed"/"Bayer" prefix to filter on) -- so both are
  // matched by ident *shape* instead after the generic '*' JOIN, via
  // membershipFilter.
  bayer: { catalogClause: `i.id LIKE '* %'`, membershipFilter: isBayerShaped },
  flamsteed: { catalogClause: `i.id LIKE '* %'`, membershipFilter: isFlamsteedShaped },
  wds: { catalogClause: `i.id LIKE 'WDS %'` },
  hip: { catalogClause: `i.id LIKE 'HIP %'` },
  sao: { catalogClause: `i.id LIKE 'SAO %'` },
  wd: { catalogClause: `i.id LIKE 'WD %'` },
  // Like NGC/IC, BD numbers are reused as a suffix base for double-star
  // components of the same cataloged position ("BD+23 512" and its
  // component "BD+23 512A" both matching the same physical star) --
  // confirmed live near M45. Restricting to a clean "BD+dd N" / "BD-dd N"
  // shape (no trailing component letter) avoids showing the same star
  // twice under two BD aliases.
  bd: { catalogClause: `(i.id LIKE 'BD+%' OR i.id LIKE 'BD-%')`, membershipFilter: isCleanBd },
};

const SINGLE_CATALOG_CATEGORIES = new Set([
  'messier', 'ngc', 'ic', 'barnard', 'arp', 'herschel400', 'herschel2', 'caldwell',
  'bayer', 'flamsteed', 'wds', 'hip', 'sao', 'wd', 'bd',
]);

// Per-category display-name rewrite, applied after the generic
// asterisk-strip/whitespace-collapse cleanup below. Only "arp" needs one
// so far (SIMBAD's own catalog prefix doesn't match the catalog's common
// name).
const NAME_REWRITES: Record<string, (name: string) => string> = {
  arp: (name) => name.replace(/^APG\s*/, 'Arp '),
};

// Extended objects are frequently missing a V-band row in SIMBAD's `flux`
// table entirely -- e.g. M4 and NGC 6144 (both real globular clusters,
// verified live) have g/z/K photometry but no V, so an INNER JOIN on
// filter='V' silently excluded them no matter how generous the mag limit
// was. Every category except "stars" LEFT JOINs across V/B/g (first
// match wins, in that priority) and keeps objects with no photometry at
// all rather than dropping them -- "stars" keeps its original strict
// INNER JOIN on V alone since that's proven correct by the existing
// skill pipeline's own verified results (e.g. 37 stars on the M45
// Mosaic).
const EXTENDED_FLUX_FILTERS = ['V', 'B', 'g'];

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(data: unknown, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

function errorJson(message: string, origin: string | null, status = 400): Response {
  return json({ error: message }, origin, status);
}

async function astrometryLogin(apiKey: string): Promise<string> {
  const body = new URLSearchParams();
  body.set('request-json', JSON.stringify({ apikey: apiKey }));
  const res = await fetch(`${ASTROMETRY_API}/login`, { method: 'POST', body });
  const data = (await res.json()) as { status: string; session?: string; errormessage?: string };
  if (data.status !== 'success' || !data.session) {
    throw new Error(`astrometry.net login failed: ${data.errormessage ?? JSON.stringify(data)}`);
  }
  return data.session;
}

async function handleUpload(request: Request, env: Env, origin: string | null): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_UPLOAD_BYTES) {
    return errorJson('Image too large (10MB max).', origin, 413);
  }

  const incomingForm = await request.formData();
  const file = incomingForm.get('file');
  if (!(file instanceof File)) {
    return errorJson('Missing "file" field.', origin, 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return errorJson('Image too large (10MB max).', origin, 413);
  }

  const session = await astrometryLogin(env.ASTROMETRY_API_KEY);

  const uploadForm = new FormData();
  uploadForm.set(
    'request-json',
    JSON.stringify({
      session,
      publicly_visible: 'n',
      allow_modifications: 'n',
      allow_commercial_use: 'n',
    })
  );
  uploadForm.set('file', file, file.name || 'upload.jpg');

  const res = await fetch(`${ASTROMETRY_API}/upload`, { method: 'POST', body: uploadForm });
  const data = (await res.json()) as { status: string; subid?: number; errormessage?: string };
  if (data.status !== 'success' || data.subid === undefined) {
    return errorJson(`astrometry.net upload failed: ${data.errormessage ?? 'unknown error'}`, origin, 502);
  }

  return json({ subid: data.subid }, origin);
}

// Single-shot check -- the client polls this endpoint on an interval so the
// Worker never has to sleep and never risks a CPU-time/duration limit.
async function handleStatus(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const subid = url.searchParams.get('subid');
  if (!subid) return errorJson('Missing subid.', origin, 400);

  const subRes = await fetch(`${ASTROMETRY_API}/submissions/${encodeURIComponent(subid)}`);
  const subData = (await subRes.json()) as { jobs?: (number | null)[]; processing_finished?: string };

  const jobId = subData.jobs?.find((j) => j !== null) ?? null;
  if (!jobId) {
    return json({ status: 'submitted' }, origin);
  }

  const jobRes = await fetch(`${ASTROMETRY_API}/jobs/${jobId}`);
  const jobData = (await jobRes.json()) as { status: string };

  if (jobData.status === 'success') return json({ status: 'solved', jobId }, origin);
  if (jobData.status === 'failure') return json({ status: 'failed', jobId }, origin);
  return json({ status: 'solving', jobId }, origin);
}

function extractFitsNumber(text: string, key: string): number {
  const match = new RegExp(`\\b${key}\\s*=\\s*([-+0-9.eE]+)`).exec(text);
  if (!match) throw new Error(`Missing WCS key: ${key}`);
  return Number(match[1]);
}

async function handleWcs(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');
  if (!jobId) return errorJson('Missing jobId.', origin, 400);

  const res = await fetch(`${ASTROMETRY_WCS_URL}/${encodeURIComponent(jobId)}`);
  if (!res.ok) return errorJson('Could not fetch WCS file.', origin, 502);
  const buf = await res.arrayBuffer();
  // The .wcs file is a FITS header: fixed-width 80-char ASCII cards, no
  // line breaks. It decodes cleanly as latin1 text for our purposes --
  // we only need to regex out a handful of numeric keys, not parse the
  // FITS structure itself.
  const text = new TextDecoder('latin1').decode(buf);

  try {
    const wcs = {
      CRVAL1: extractFitsNumber(text, 'CRVAL1'),
      CRVAL2: extractFitsNumber(text, 'CRVAL2'),
      CRPIX1: extractFitsNumber(text, 'CRPIX1'),
      CRPIX2: extractFitsNumber(text, 'CRPIX2'),
      CD1_1: extractFitsNumber(text, 'CD1_1'),
      CD1_2: extractFitsNumber(text, 'CD1_2'),
      CD2_1: extractFitsNumber(text, 'CD2_1'),
      CD2_2: extractFitsNumber(text, 'CD2_2'),
      IMAGEW: extractFitsNumber(text, 'IMAGEW'),
      IMAGEH: extractFitsNumber(text, 'IMAGEH'),
    };
    return json(wcs, origin);
  } catch (err) {
    return errorJson((err as Error).message, origin, 502);
  }
}

// Minimal CSV parser -- handles the SIMBAD TAP CSV output shape (quoted
// fields for main_id/otype/sp_type, no embedded commas seen in practice,
// but quotes are still respected defensively).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        fields.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    fields.push(cur);
    rows.push(fields);
  }
  return rows;
}

async function handleSimbadCone(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const ra = Number(url.searchParams.get('ra'));
  const dec = Number(url.searchParams.get('dec'));
  const radiusDeg = Number(url.searchParams.get('radiusDeg'));
  const maglimit = Number(url.searchParams.get('maglimit') ?? '12');
  const category = url.searchParams.get('category') ?? '';

  if (!Number.isFinite(ra) || !Number.isFinite(dec) || !Number.isFinite(radiusDeg)) {
    return errorJson('Missing/invalid ra, dec, or radiusDeg.', origin, 400);
  }
  if (!(category in CATEGORY_DEFS)) {
    return errorJson(`Unknown category "${category}".`, origin, 400);
  }
  const clampedRadius = Math.min(Math.max(radiusDeg, 0), MAX_RADIUS_DEG);
  const clampedMag = Math.min(Math.max(maglimit, -5), MAX_MAG_LIMIT);
  const def = CATEGORY_DEFS[category];

  // Common proper name (e.g. "Sirius", "Betelgeuse"), where SIMBAD has
  // one -- stored as its own "NAME xxx"-prefixed row in `ident`, same
  // table as every other alias. A correlated scalar subquery in the
  // SELECT list (the first approach tried here) is rejected outright by
  // SIMBAD's ADQL parser (confirmed live 2026-08-01: "Encountered
  // 'SELECT' ... reserved ADQL word"), so this has to be a real LEFT
  // JOIN instead -- which, like the existing catalog-alias JOIN below,
  // can multiply row cardinality (rare stars have more than one
  // recognized name) and needs the same kind of post-query dedup.
  const commonNameJoin = `LEFT JOIN ident AS n ON b.oid = n.oidref AND n.id LIKE 'NAME %'`;

  let adql: string;
  if (category === 'stars') {
    adql = `SELECT b.main_id AS name, b.ra, b.dec, b.otype, b.sp_type, b.coo_qual, f.flux AS vmag, n.id AS common_name
      FROM basic AS b
      JOIN flux AS f ON b.oid = f.oidref
      ${commonNameJoin}
      WHERE f.filter='V'
      AND ${def.otypeClause}
      AND 1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${ra}, ${dec}, ${clampedRadius}))
      AND f.flux <= ${clampedMag}
      ORDER BY vmag ASC`;
  } else {
    const filterList = EXTENDED_FLUX_FILTERS.map((f) => `'${f}'`).join(',');
    const identJoin = def.catalogClause ? 'JOIN ident AS i ON b.oid = i.oidref' : '';
    // No coo_qual filter here, deliberately -- 'E' (rounded/coarse position)
    // is the NORMAL quality for a diffuse object's catalogued centroid, not
    // a sign of bad data. Verified live: Barnard 44/45 (real, well-known
    // dark nebulae) are cataloged as 'LDN 1712'/'LDN 1744' at coo_qual='E',
    // and 350 of ~372 total Barnard-catalog objects in SIMBAD are 'E' --
    // excluding it would drop the vast majority of the catalog. The 'E'
    // exclusion on the "stars" path above is different and stays: that's
    // proven correct for point sources, where a coarse position really
    // does mean the marker lands off-target (site's own star-slider pilot).
    const whereParts = [
      def.otypeClause,
      def.catalogClause,
      `1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${ra}, ${dec}, ${clampedRadius}))`,
      `(f.flux <= ${clampedMag} OR f.flux IS NULL)`,
    ].filter(Boolean);
    // For a single-catalog category (one specific ident prefix, no
    // ambiguity about which alias matched), show the actual catalog
    // designation the user asked for rather than SIMBAD's own arbitrary
    // "preferred" identifier -- e.g. Barnard 44 is real and in-field, but
    // its main_id is "LDN 1712", which would mean nothing to someone who
    // clicked "+ Barnard". hii/reflection match against 4 different
    // catalog prefixes at once (an object could satisfy more than one),
    // so there's no single unambiguous alias to prefer there -- main_id
    // stays correct for those, same as the type-only categories.
    const nameExpr = SINGLE_CATALOG_CATEGORIES.has(category) ? 'i.id AS name' : 'b.main_id AS name';
    adql = `SELECT ${nameExpr}, b.ra, b.dec, b.otype, b.coo_qual, f.filter, f.flux, n.id AS common_name
      FROM basic AS b
      ${identJoin}
      LEFT JOIN flux AS f ON b.oid = f.oidref AND f.filter IN (${filterList})
      ${commonNameJoin}
      WHERE ${whereParts.join(' AND ')}
      ORDER BY name`;
  }

  const body = new URLSearchParams();
  body.set('request', 'doQuery');
  body.set('lang', 'adql');
  body.set('format', 'csv');
  body.set('query', adql);

  const res = await fetch(`${SIMBAD_TAP}?${body.toString()}`);
  if (!res.ok) return errorJson('SIMBAD query failed.', origin, 502);
  const csv = await res.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) return json([], origin);

  const header = rows[0].map((h) => h.trim());
  const idx = (col: string) => header.indexOf(col);
  const iName = idx('name');
  const iRa = idx('ra');
  const iDec = idx('dec');
  const iOtype = idx('otype');
  const iCooQual = idx('coo_qual');
  const iCommonName = idx('common_name');
  const cleanCommonName = (raw: string | undefined) =>
    raw ? raw.replace(/^NAME\s*/, '').trim().replace(/\s+/g, ' ') : null;

  if (category !== 'stars') {
    // Non-star categories can come back with multiple rows per object --
    // one per matched flux filter (e.g. M31 has both a V and a B row), or
    // one per matched catalog identifier for categories with a
    // catalogClause (an object can have more than one qualifying alias
    // in `ident`). Group by name and keep the best available filter
    // (V > B > g), or no magnitude at all if the object has none of the
    // three.
    const iFilter = idx('filter');
    const iFlux = idx('flux');
    const priority: Record<string, number> = { V: 0, B: 1, g: 2 };
    const byName = new Map<string, { ra: number; dec: number; otype: string; mag: number | null; filterRank: number; commonName: string | null }>();
    const rewrite = NAME_REWRITES[category];
    for (const r of rows.slice(1)) {
      let name = r[iName].replace(/^\*\s*/, '').trim().replace(/\s+/g, ' ');
      if (rewrite) name = rewrite(name);
      const ra_ = Number(r[iRa]);
      const dec_ = Number(r[iDec]);
      if (!Number.isFinite(ra_) || !Number.isFinite(dec_)) continue;
      const filter = r[iFilter];
      const flux = r[iFlux] ? Number(r[iFlux]) : null;
      const filterRank = filter && filter in priority ? priority[filter] : 99;
      const commonName = cleanCommonName(r[iCommonName]);
      const existing = byName.get(name);
      if (!existing) {
        byName.set(name, { ra: ra_, dec: dec_, otype: r[iOtype], mag: flux, filterRank, commonName });
      } else {
        if (filterRank < existing.filterRank) {
          existing.ra = ra_;
          existing.dec = dec_;
          existing.otype = r[iOtype];
          existing.mag = flux;
          existing.filterRank = filterRank;
        }
        if (!existing.commonName && commonName) existing.commonName = commonName;
      }
    }
    let objects = Array.from(byName.entries()).map(([name, o]) => ({
      name,
      ra: o.ra,
      dec: o.dec,
      otype: o.otype,
      spType: null,
      mag: o.mag,
      commonName: o.commonName,
      listNumber: listNumberOf(category, name),
    }));
    if (def.membershipFilter) objects = objects.filter((o) => def.membershipFilter!(o.name));
    if (category === 'wd') {
      // Unlike BD's component-letter suffixes, the WD catalog's duplicate
      // aliases for the same star aren't a simple suffix pattern -- e.g.
      // "WD 0642-16", "WD 0642-163", and "WD 0642-166" are three
      // completely different-looking but fully valid SIMBAD idents for
      // the exact same star (confirmed live, identical ra/dec to 10+
      // decimal places), reflecting different historical WD-catalog
      // naming precision. Name-based grouping doesn't catch this since
      // the names themselves differ -- dedupe by rounded coordinate
      // instead, coarse enough to collapse "same star, different alias"
      // but far tighter than any real close pair would ever be.
      const seenCoords = new Set<string>();
      objects = objects.filter((o) => {
        const key = `${o.ra.toFixed(4)},${o.dec.toFixed(4)}`;
        if (seenCoords.has(key)) return false;
        seenCoords.add(key);
        return true;
      });
    }
    return json(objects, origin);
  }

  const iMag = idx('vmag');
  const iSpType = idx('sp_type');
  // The common-name LEFT JOIN can multiply a star's row (rare stars carry
  // more than one recognized proper name) -- group by name and merge
  // rather than emitting duplicate markers for the same star.
  const byNameStars = new Map<string, { ra: number; dec: number; otype: string; spType: string | null; mag: number; commonName: string | null }>();
  for (const r of rows.slice(1)) {
    if (r[iCooQual] === 'E') continue;
    const name = r[iName].replace(/^\*\s*/, '').trim().replace(/\s+/g, ' ');
    const ra_ = Number(r[iRa]);
    const dec_ = Number(r[iDec]);
    const mag_ = Number(r[iMag]);
    if (!Number.isFinite(ra_) || !Number.isFinite(dec_) || !Number.isFinite(mag_)) continue;
    const commonName = cleanCommonName(r[iCommonName]);
    const existing = byNameStars.get(name);
    if (!existing) {
      byNameStars.set(name, { ra: ra_, dec: dec_, otype: r[iOtype], spType: r[iSpType] || null, mag: mag_, commonName });
    } else if (!existing.commonName && commonName) {
      existing.commonName = commonName;
    }
  }
  const objects = Array.from(byNameStars.entries()).map(([name, o]) => ({ name, ...o }));

  return json(objects, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    try {
      if (request.method === 'POST' && url.pathname === '/solve/upload') {
        return await handleUpload(request, env, origin);
      }
      if (request.method === 'GET' && url.pathname === '/solve/status') {
        return await handleStatus(request, origin);
      }
      if (request.method === 'GET' && url.pathname === '/solve/wcs') {
        return await handleWcs(request, origin);
      }
      if (request.method === 'GET' && url.pathname === '/simbad/cone') {
        return await handleSimbadCone(request, origin);
      }
      return errorJson('Not found.', origin, 404);
    } catch (err) {
      return errorJson((err as Error).message, origin, 500);
    }
  },
};
