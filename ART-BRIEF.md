# AI Art Brief — Slice 1 (hero + one scene)

You generate the illustrations; I cut them out, texture, optimise and wire them into the 3D scene. **You do NOT need transparent PNGs** — generate on a plain flat background and I'll remove it here.

---

## 1. The style anchor — paste this into EVERY prompt

> black-ink **manga / seinen** illustration, bold varied linework with **halftone screentone** shading, on **aged cream paper** texture; **Hindu / Telugu temple** iconography, sacred and cinematic; accent palette **kumkum red (#a5262a), turmeric gold (#e0a83c), indigo (#26314f)**; dramatic sumi-e brush strokes, high detail, strong clean silhouette

Keeping this identical across images is what makes them look like one artist drew them.

**Negative / avoid:** photorealism, 3D render, western cartoon, extra fingers, text/watermark, cluttered background, neon, gradients.

---

## 2. What to generate for Slice 1

### ART-01 — Hero figure (required)  ·  Krishna as sarathi (the guide)
Purpose: the centrepiece of the landing/hero.
Prompt:
> [STYLE ANCHOR] — full-body portrait of **Lord Krishna as a charioteer (sarathi)**, holding chariot reins, calm and powerful, peacock feather in hair, flute at his side, flowing dhoti; heroic three-quarter pose; centered; **plain flat light-grey background**.
- Aspect **3:4** (portrait) · size **≥ 2048 px tall** (bigger is better)
- Plain background (I'll cut him out)

### ART-02 — Environment backdrop (required)  ·  Kurukshetra dawn
Purpose: the world behind the hero / the 3D scene backdrop.
Prompt:
> [STYLE ANCHOR] — wide atmospheric scene of a **Kurukshetra plain at dawn**, a faint **Sudarshana chakra** as the rising sun, distant **temple gopuram** silhouettes, dramatic clouds with halftone shading; **no people**; cinematic, deep depth.
- Aspect **16:9** (landscape) · size **≥ 2560 px wide** (4K if you can)

### ART-03 — Texture sheet (optional; I can also do this procedurally)
Prompt:
> high-resolution **sumi-e ink brush strokes, splatters and a torn-edge frame**, pure black on white; separately, an **aged cream washi paper** texture and a **gold-leaf foil** texture.
- Aspect **1:1** · as large as possible · plain (no subject)

> Generate ART-01 first. If your tool supports a **style reference** (Midjourney `--sref`) or **character reference** (`--cref`), grab it from ART-01 and reuse it on the others — that's how we'll keep Krishna and the style consistent across every project book later.

---

## 3. Where to generate from (recommended tools)

- **Midjourney (v6/v7)** — best for stylised manga + consistency (`--sref` style ref, `--cref` character ref). Top pick.
- **Leonardo.ai** — free tier, good anime/manga models.
- **Google ImageFX / Gemini**, **OpenAI (ChatGPT image)** — easy, decent.
- **Stable Diffusion + a manga/anime LoRA** (ComfyUI/A1111) — you've used Stability AI before; best control if you want it.

Send **2–3 variations per slot** if you can — I'll pick the strongest, or composite.

---

## 4. Where to drop the files

Put the raw exports (any format, any filename) into this folder — I'll create it:

```
D:\Krishna\PORTFOLIO\incoming-art\
```

Just tell me which file is which (e.g. "the two Krishna ones are ART-01"). I'll then:
1. Remove backgrounds / cut out the figure,
2. Add paper/ink texture passes and optimise to WebP,
3. Rename and place them at their real code paths:
   - `portfolio/public/art/hero/krishna.webp`
   - `portfolio/public/art/hero/backdrop.webp`
   - `portfolio/public/art/textures/…`

> **[STATUS 2026-07-20]** The app folder was renamed `portfolio-site/` →
> `field-concepts/` → **`portfolio/`**; paths above are corrected.
> Four WebP assets exist at those paths (`krishna`, `krishna-mist`, `backdrop`,
> `ink-temple`) and are exported as `art` in `portfolio/data/profile.ts` — but
> **nothing on the site uses them yet**. They are the intended Layer B fill for
> the epic gateways, which currently use line sigils (conch / bow).
> `incoming-art/` still holds 13 unprocessed JPGs.

That's everything for Slice 1. Later slices (each project as a mini manga-book, and the personal side in its own style) will reuse this exact pipeline — I'll send fresh prompts per batch.
