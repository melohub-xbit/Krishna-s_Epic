# Element Craft Spec (3D) — v0.2

> **Status:** the *standard* below still governs all work. Several *specifics*
> were changed during the build — day/night/cosmic theming was dropped, and the
> chakra's centre and petal count changed. Corrections are marked **[BUILT]**
> inline. See `PROJECT-STATUS.md` for the current state.

The standard: **research the true form → build an accurate blueprint → sculpt it in 3D with real material and light.** No flat shapes pasted together. In-engine (react-three-fiber) we reach the *carved, hand-worked* feel through **geometry + baked normal/height maps + PBR materials + a lighting rig** — deep relief and engraved recesses without an impossible polycount.

See [[detail-standard]]. Every element below follows the same four-part recipe: **Authentic form · 3D construction · Material · Motion**.

---

## 0. Shared systems (built once, used by every element)

**Carving pipeline.** For each ornament: (1) build the accurate vector/parametric blueprint (like the chakra we drew), (2) bake it to a **height map** and **normal map**, (3) apply to a moderately-tessellated base mesh via displacement (silhouette) + normal (fine engraving), (4) add an **AO/cavity map** so recesses darken like real patina. This is what makes gold read as *carved*, not printed.

**Materials (PBR, MeshStandard/Physical):**
- **Temple gold** — metalness 1.0, roughness 0.25–0.45 varied by a roughness map (polished highs, matte recesses), warm base `#c9922e`, an **HDRI environment map** for real reflections, anisotropy along engraving, cavity/AO for patina.
- **Ink-glass** (the crystal) — `MeshPhysicalMaterial` transmission ~0.9, thickness, dark smoke tint, roughness ~0.15, subtle dispersion; refracts what's behind it.
  **[BUILT]** One theme only — no day/night/cosmic variants. Built in `InkGlass.tsx` as a flat disc (a flattened sphere goes mirror-like at the rim), tint `#9a6a45` smoky amber (ink-density tint extinguished the subject), `thickness` 0.14, `ior` 1.28, `envMapIntensity` 0.22. **Currently not rendered on the site** by request.
- **Ruby / kemp stones** — transmission + deep red, high clearcoat, tiny facets.
- **Sumi ink** — for 2D-on-plane elements: matte, paper-grain roughness, no metalness.
- **Chalk / rice-flour** — for kolam: matte, powdery, faint self-emissive glow.

**Lighting rig (reveals the carving):** a warm **key** (upper-left), a cool **rim** (behind, for edge separation), a soft **fill**, plus the **HDRI env** for metal. Recesses fall to shadow → relief reads. Bloom stays low so gold glints rather than glows.
**[BUILT]** `Crystal.tsx`: warm key 1.15, saffron fill, one faint cool rim, kumkum bounce from below so recesses go warm-dark rather than grey. Key was pulled back from 1.5 and bloom threshold raised to 0.88 because the cardinal flames were clipping to pure white.

**Performance budget:** normal/height maps do the fine detail; geometry only for silhouette and big relief; instancing for repeated units (flames, spokes, petals, beads); LOD + frustum cull; target 60fps mid-laptop.

---

## 1. Sudarshana Chakra  *(core of the hero crystal)*

**Authentic form** (per the texts): a fiery discus — **twelve spokes** (twelve months/deities), **six navels** held in a **shatkona** hexagram, a **vajra at the centre**, a **double ring of flame/razor edges**, concentric bands of **jāli filigree**, **sixteen lotus petals**, ruby/kemp gem-work, and a **bīja-mantra band** ("ॐ सुदर्शनाय नमः"). Reference: our v2 blueprint + traditional temple-gold chakra ornaments.

**[BUILT] — three deviations, all deliberate:**
- **Shatkona → ashtadala.** Authentic, but as an isolated six-pointed outline it read as a Star of David. Replaced with the eight-petalled lotus, a traditional Vaishnava centre. Eight divides 24, so the angular rule holds.
- **Vajra moved out of the centre.** Invisible twice — its bars sat inside the shatkona's hexagon at the same gold tone, reading as four stray dots. It now terminates the four cardinal spokes.
- **16 petals → 24.** 16 shares almost no divisors with 12/24, so the rings only agreed at a handful of points and visibly drifted. **Everything is now 12 / 24 / 48.**
- The **bīja-mantra band** is not built.

**3D construction:** lathe the concentric **bands/rings** from a profile (gives real edge thickness); **instance** flames (24 outer + 24 inner), spokes (12), petals (24), beads (48), jali (48), gems around the axis; the **jāli lattice** cut as real holes; the **ashtadala + bindu** as raised geometry at centre; deep bevel on every edge.

**[BUILT]** All radii derive from one `BANDS` table — never hand-type a radius twice, they drift. Jali is a real `ExtrudeGeometry` with 48 holes cut through, not studs applied to a solid band. A recessed backing plate sits behind the medallion so gaps read as dark metal rather than showing the background through. Normal/height-map baking was **not** done; the antique read comes from palette spread + backing plate + lathe grooves instead.

**Material:** temple gold + cavity patina; rubies in the spoke sockets and gem ring; the mantra band engraved (normal map).

**Motion:** slow majestic spin (the wheel of time); catches the key light as it turns; flames shimmer via a subtle emissive flicker.

---

## 2. The Hero Crystal  *(కృ + chakra, form D)*

**Form:** the carved chakra (§1) rendered in **ink-glass**, slowly spinning **behind**; the **కృ seal** as a faceted glass letterform floating **in front**; both refract the cosmos.

**3D construction:** chakra geometry from §1 but with the ink-glass material; కృ extruded from the Telugu glyph outline, beveled, faceted. Depth offset between the two for parallax. A thin gold rim on the chakra so the carving still catches light through the glass.

**Material:** ink-glass (smoky transmission). Refraction samples the field behind it.

**Motion & morph:** floats, tracks cursor, rotates with scroll; **morphs across sections** solid glass → wireframe → single ink line (Alche-style), going translucent as a section takes over.

**[BUILT] — and then switched off.** `InkGlass.tsx` works: a flat transmissive
disc smaller than the chakra, so the flame nimbus breaks past its edge (sharp
fire outside, refracted metal inside), with the కృ seal in a double gold ring in
front, drifting counter to the chakra's spin. **Krishna's call: keep the design,
don't put it on the site** — the import and `<InkGlass />` are commented out in
`Crystal.tsx`. Uncomment both to restore.

Telugu shaping is verified: కృ is a conjunct (క + ృ vattu) that many 3D text
engines split into two glyphs. troika `<Text>` + Noto Sans Telugu Bold renders
it correctly. No day/night or cosmic variants — one theme only. Cursor tracking
and the section morph are **not** implemented.

---

## 3. Toranam  *(mango-leaf + marigold doorway garland)*

**Authentic form:** a string hung in a **catenary**; alternating **mango leaves** (each with a central midrib and fine veins, tips curling), **folded-leaf parrots** at intervals, and **marigold flower clusters**; often betel leaves / small bells. A festive doorway blessing.

**3D construction:** sculpt one **mango leaf** (curved plane, veins via normal map, slight thickness), **instance** it along a hanging curve; **marigold** as layered concentric petal rings (real geometry) with a red core; **parrot** as a folded leaf with a carved beak/eye. Cloth-style **sway** on the string.

**Material:** leaf green with subsurface translucency (light through the leaf), marigold gold-orange velvet, red core, thin string.

**Motion:** gentle pendulum sway + per-leaf flutter; marigolds bob.

**[BUILT] as 2D SVG, not 3D** — `Motifs.tsx: Torana()`. Heads the About and
Contact sections. The string is a **true catenary** (cosh); mango leaves carry a
midrib and five pairs of lateral veins; marigolds are three concentric petal
rings around a core. No parrots, no sway animation yet.
*Gotcha:* written the wrong way round the catenary inverts and lands hundreds of
units off-canvas. A garland is highest at its ends and dips in the middle, and
SVG y grows downward.

---

## 4. Conch — Panchajanya

**Authentic form:** a **right-turning (dakṣiṇāvarti)** conch — the sacred whorl spirals clockwise; ribbed outer surface, a long tapering spire, a flared aperture; Krishna's conch, sound of creation.

**3D construction:** a **helical sweep** for the spiral body (log-spiral profile), ridges via displacement along the whorl, flared lip; sculpted knobs on the spire. Correct dakṣiṇāvarti handedness.

**Material:** ivory/pearl with **iridescent** sheen (thin-film), or ceremonial gold-mounted; soft subsurface.

**Motion:** slow turn showing the spiral; used as the **Mahabharatam** gateway motif and the transition "blast" ripple.

**[BUILT] as 2D SVG** — `Motifs.tsx: Conch()`. Generated from a **logarithmic
spiral** (r = a·e^bθ), the curve a shell actually grows on, wound **clockwise**
for correct dakṣiṇāvarti handedness — getting this backwards inverts the
meaning. 13 ribs across the whorl, flared aperture, tapering spire. Used as the
Mahabharatam gateway sigil and section mark. No turn animation or ripple.

---

## 5. Bow — Kodanda / Śārṅga

**Authentic form:** a **recurved** bow (limbs curve back near the tips), an ornate carved **grip** at centre, decorated limbs with fittings, a taut string; the divine bow of Rama/Vishnu.

**3D construction:** sweep the limb curve from a profile (real cross-section), recurve the tips, ornate grip geometry with engraved bands (normal map), string as a thin tube.

**Material:** carved horn/wood with **gold fittings** and engraving; string subtly glinting.

**Motion:** the **Ramayanam** gateway motif; a pinned scroll-scene where an arrow of light draws and looses.

**[BUILT] as 2D SVG** — `Motifs.tsx: Bow()`. Recurved limbs (bending back near
the tips, which is what distinguishes it from a plain arc), engraved fittings,
ornate grip, taut string as a straight chord nock to nock. Ramayanam gateway
sigil. The arrow scroll-scene is **not** built.

---

## 6. Kolam / Muggu

**Authentic form:** a **pulli (dot) grid** with **continuous looping lines** (sikku/chikku kolam) or filled rangoli; drawn in **rice flour** on the threshold — Telugu muggu. Symmetry, unbroken loops (auspicious).

**3D construction:** it's floor **powder art**, not carved metal — so: a ground plane with the kolam as a glowing **rice-flour line** (tube geometry or a shader line), a **self-drawing** animation (stroke reveal), powdery matte texture.

**Material:** chalk/rice-flour — matte, slightly emissive, grain.

**Motion:** inks/draws itself on load; sits under the crystal as the "floor" of the world.

**[BUILT] twice, differently from the plan.**
1. **3D** — `KolamField.tsx`, a GLSL shader on a flat plane at z=-9. Not a floor
   under the crystal: it is a **flat backdrop**, because the original ring/dot/
   nebula stack read as objects floating in front of the viewer rather than as
   a background. Interlocking loops on a pulli grid, with manga screentone and
   speed-line hatch layered over it, faded out at centre so it never crowds the
   chakra. No self-drawing animation — slow drift only.
2. **2D** — a `kolam` SVG pattern in `Patterns.tsx` for panel washes.

---

## 7. Krishna  *(supporting, not the hero)*

The hero is now the crystal, so Krishna is **supporting**: he appears as a **reflection/refraction inside the crystal**, or in a section panel — as the illustrated cut-out we already have (or an upgraded sculpt/illustration later). Not a full standing figure in the hero.

---

## 8. Build order

1. ~~**Materials + lighting rig + carving pipeline** (shared)~~ — **[DONE]**,
   except normal/height-map baking, which was never built.
2. ~~**Sudarshana Chakra** sculpt → **the hero crystal** (chakra ink-glass + కృ)~~
   — **[DONE]**; the crystal is switched off by request.
3. ~~Toranam, then conch + bow (epic gateways), then kolam~~ — **[DONE]**, but as
   **2D SVG**, not 3D sculpts. See §9.
4. ~~Integrate into the scene flow.~~ — **[DONE]**, full site built.

Each element: gather 2–3 reference images of the authentic object first, build the blueprint, then sculpt — so nothing is guessed.

---

## 9. What actually got built, and the one place the plan changed

The **standard** held: every element is constructed from its real geometry —
log spiral, catenary, recurve, hexagon-centroid lattice — never eyeballed.

The **medium** changed. This spec assumed everything would be a 3D sculpt. In
practice only the **chakra, the ink-glass and the kolam field** are 3D; the
torana, conch, bow, hanko, rosette and every wagara pattern are **2D SVG**,
because they sit in the DOM foreground alongside type where 3D would be both
unreadable at that scale and far more expensive.

Extra elements not in this spec, built for the manga layer
(`components/ornament/`):

- **Asanoha** (麻の葉) — hexagon split by its three diagonals, then a three-armed
  star from each triangle's corners to its **centroid**. The centroid star *is*
  the leaf; diagonals alone give a plain hex lattice.
- **Seigaiha** (青海波) — nested arc fans on a half-drop lattice.
- **Sayagata** (紗綾形) — interlocking key fret.
- **Screentone / speed lines** — manga halftone and radial hatch.
- **Panel frame** — kumiko bracket interlocked with a Telugu lotus palmette,
  volute, boss, engraving ticks. Rules stretch; **corners never do**.
- **Hanko** (印鑑) — carved seal in kumkum red carrying కృ, edge roughened by a
  turbulence filter. A clean rectangle reads as a sticker, not a stamp.

**Still unbuilt from this spec:** normal/height/AO map baking, mango-leaf
parrots, garland sway, conch turn + ripple, the bow's arrow scroll-scene, the
kolam self-draw, the crystal's cursor tracking and section morph, and the
bīja-mantra band.
