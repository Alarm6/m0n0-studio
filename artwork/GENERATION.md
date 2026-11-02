# Seven motion artworks for m0n0

Generated with the built-in `image_gen.imagegen` tool. Each reference was processed
in a separate call with `transparent_background: true`. Original generated cutouts
are preserved in `generated/`. The supplied reference files were not overwritten.

Only the floating `.scroll-burst` cards and falling `.physics-cards` consume these
assets. `#gallery`, its carousel, and the all-works overview are excluded.

## Animation deliverables

`../dist/assets/motion/` contains seven infinite-loop GIFs, seven animated WebPs,
seven still WebP posters and a machine-readable manifest. The browser selects
animated WebP with a GIF fallback; reduced-motion users receive a still poster.
Motion is layered 2D product animation: floating/rocking cutouts, pulsing glow,
and a moving periodic forest for the car. It is not articulated video generation.
The GIFs contain 48 frames at 60 ms per frame. WebP uses 63 ms per input frame;
its encoder can combine adjacent identical frames. The rendering script is
`../scripts/render_art_loops.py`.

## Prompt set

### 1. rope-bag

Use case: precise-object-edit / stylized product variant. Edit target: attached olive utility bag image. Create a distinctly redesigned premium olive nylon handbag inspired by its tactile outdoor craft, retaining olive green cloth, thick brown braided rope handles, dark navy and mustard rope details, polished silver carabiners and brown beads. Change the bag silhouette, weave arrangement, knots and hardware placement so it is an original variation. Show the complete bag, centred in a square composition, handle fully visible with comfortable margins. Photoreal luxury studio product photograph, fine fabric weave and polished metal, soft directional light. Isolate the object on a genuinely transparent background for an animated website asset. Remove ALL text, letters, symbols, labels, logos, tags and watermarks; do not reproduce the original branded strap. No typography anywhere. Output one high quality static cutout, not a layout or collage. Preserve the reference colour palette and subject idea.

The following six prompts all begin with:

> Use case: precise-object-edit / original visual variation for a small animated website card.

### 2. chrome-avatar

Edit target: the attached stylized adult female avatar reference. Create an original glossy high-end 3D floating head of an ADULT fashion woman, changing facial identity, hairstyle detail and accessory designs. Preserve the palette: brunette hair with honey-blonde fringe, pale peach skin, pale green eyes, transparent sculptural cat-eye spectacles, polished chrome earrings and hair ornaments, one soft pink blank bubble-shaped accessory and one fuzzy sky-blue accessory. Keep a sophisticated playful editorial 3D fashion aesthetic, not a photo of a real person. Face front with a subtle three-quarter angle, complete head and accessories with generous margins in square composition. Isolate the entire composition on transparent background. Absolutely no writing or typography on any accessory; the pink bubble and fuzzy blue charm are blank shapes. Remove all original labels, brand names, title, footer text and watermarks. Output a single original static cutout with beautiful detailed materials.

### 3. gamepad

Edit target: attached rear three-quarter silver-white game controller. Create an original futuristic gamepad product photograph, redesigning grip silhouette, rear triggers and light channel arrangement while preserving recognisable controller function. Pearlescent silver-white housing, graphite rubber shoulder triggers, thin electric-blue light accents, cool blue reflections. Full object isolated on genuinely transparent background, centred square composition with 12 percent margins. Dynamic underside/rear three-quarter view. Luxury hardware advertising, precise seams and fine tactile surfaces. Absolutely no text, logos, Sony branding, letters, numerals, button labels, CE marks, serial numbers, decals or watermark anywhere. One unbranded product, no hands.

### 4. orange-cats

Edit target: attached three glowing orange cats. Reimagine the trio with different graceful walking poses and a revised loose circular arrangement, maintaining exactly three cats, their vivid fluorescent tangerine/orange-red colour and soft otherworldly glow. All three complete cats visible, each anatomically coherent with four legs and one curving tail, balanced composition, no overlap of faces. Stylized photographic surrealism with soft volumetric fur and gentle analog softness, distinct dark eyes. Isolate all three cats as a single composition on genuinely transparent background, preserving their orange glow around the silhouettes. No cyan background in the cutout; cyan-grey will be added for animation. Square artwork, generous 10 percent margins. No text, no logos, no watermark. Original variant rather than exact reproduction.

### 5. jade-figure

Edit target: attached green marbled block toy figure. Create an original collectible modular humanoid toy, revised proportions with rounded block head, broader curved torso, simple sculptural claw hands and small joint details, preserving the glossy pale olive/lime green ceramic-resin material with darker green mineral inclusions and translucent marbling. Full body visible, neutral standing pose, luxury macro product rendering, softly lit edges and wet glossy reflections. Genuinely transparent background; black will be added later. Square composition centred with generous margins. No eyes or face needed, abstract blank head. Remove ALL typography, logos, poster titles, numbers, symbols and watermark. One single toy, not a collage.

### 6. vinyl-creature

Edit target: attached teal and purple vinyl kaiju collectible on red background. Make an original, visibly redesigned friendly fierce four-armed fantasy reptile collectible: jade/emerald textured scales, pale lavender segmented belly, small amber eyes, warm gold claws, dark brown sculptural horn shapes, subtle amber translucent wing-like fins behind. Revise head shape, horn arrangement, scale pattern and pose so it is an original creature, retaining premium glossy sofubi vinyl toy craftsmanship and the original green/purple/gold palette. Entire standing creature fully visible, studio three-quarter product rendering, square composition with generous margins. Isolate on genuinely transparent background; vivid vermilion red will be added later. Absolutely no Japanese lettering, titles, numerals, branding, poster layout or watermarks.

### 7. silver-coupe

Edit target: attached silver classic sports coupe driving past a green forest. Create an original automotive photograph of a redesigned late-1980s silver rear-engine sports coupe, complete side profile facing right with a slight rear three-quarter perspective, flowing rounded fenders, raised rear spoiler, black window trim, polished round alloy wheels, cool lilac highlights in silver paint. Preserve its compact classic sporting character and colour palette but alter body details, wheel design and spoiler to be an unbranded variation. Isolate the entire car on a genuinely transparent background for compositing into a moving green forest loop. All wheels and bumpers fully visible, square composition with a wide car centred and comfortable margins. Sharp car body and slightly rotationally blurred wheels, studio-quality natural reflections. No lettering, no license plate characters, no logos, no badges, no watermarks. No road or background in this cutout.
