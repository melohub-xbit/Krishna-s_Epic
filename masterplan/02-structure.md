# 02 · Structure

## The page

One scroll. Five sections. Nothing else on `/`.

```
01  ENTRY     ద్వారం   the wordmark resolves; who and where
02  ABOUT     పరిచయం   a projection, and the thing projecting it
03  WORK               22 bounty posters, on a rail you step into
04  SKILLS    అస్త్రాలు  barcode bands, one per group
05  CONTACT   ముద్ర    email and links
```

Five, and only five. Restraint here is what buys the motion budget — five
sections can each afford a proper entrance; fifteen can afford nothing.

**Section 02 carries no Telugu.** The posters carry the other half of the
theme by themselves, and mixing the two scripts on a card that small made it
fussy. Telugu stays in the wordmark, the other headings and the footer.

### 01 · Entry — the halftone, the log, the wall
Three layers, arriving in order rather than all at once.

**The halftone.** The photograph fills the right of the frame as a real
halftone — a staggered screen where each dot's radius is set by how bright the
picture is under it. It is monochrome, and within a radius of roughly a
quarter of the viewport the dots take their **actual colour** out of the photo
instead, feathered so there is no hard circle. Outside the picture the torch
lights the background lattice accent. The colour is a hole you carry around.

**And it travels.** The picture is not painted into the hero — it is painted
into a *slot*. There is a second slot inside the About projection, and one
fixed field canvas maps the picture through a rectangle interpolated between
the two as you scroll. So it does not cross-fade from one section to the
other; the same halftone walks up the page and lands in the projector's beam.
Because the dot pitch is a fraction of that rectangle's width, the screen gets
finer as the picture shrinks: **the halftone resolves as it lands.** Both slots
carry the photograph's own aspect ratio, so nothing is ever stretched.

The whole thing is one canvas for the whole site — see `04 · The field`.

**The boot log.** The page comes up like a device — eight true lines type out
in mono, each checking off, ending in `ready … online`. Under a second and a
half, skipped instantly by any input, and skipped outright on the second visit
in a session. Nobody should have to watch it twice.

**The name wall.** When the log finishes it collapses and five rows of the
name at wall size drift in, alternating direction: VELIDANDA, కృష్ణ సాయి,
KRISHNA SAI solid through the middle, వెలిదండ, VELIDANDA KRISHNA SAI. Outlined
except the hot row, masked top and bottom so it never fights the copy.

Then the statement, the three facts, and `online · ↓ scroll`.

There is no separate wordmark any more — the wall is the wordmark, so
`DotText` is gone.

### 02 · About — the projection
Two design languages, deliberately opposed.

**The base is Apple.** A liquid-glass slab: real depth, a blurred and
saturated backdrop, a rim light along the top edge and a dark one along the
bottom, and a specular highlight that travels slowly across it. The mark sits
in a recessed lens in the middle, with light spilling off it.

**What it throws is Nothing.** Monochrome, dot matrix, scan lines, mono caps,
hairlines — no gradient anywhere inside the projection. The photo is screened
through the same halftone the rest of the site is built from and resolves to
the real thing on hover. The beam is a clipped cone widening upward from the
lens, made of the same dot lattice, fading out at the top.

The one is a made object; the other is made of light and pixels. That
contrast is the whole point of the section.

Around the projection sit the callouts — education, achievements, experience
— each with a dashed leader line pointing in. The projection is the person;
the callouts are the file on him.

Entry runs in order: base rises, beam sweeps up, figure resolves out of blur,
callouts arrive last. Then a very slow idle flicker, which reduced motion
turns off.

### 03 · Work — the rail
All 22 as **bounty posters**: WANTED, what it is wanted for, the project's
mark, the name, and the figure it is wanted for. A placing stamps the corner.

**You scroll it like anything else — the rail just runs sideways.** While
the cursor is over it and it still has room to travel, the wheel moves the
rail; the moment it reaches either end the wheel goes back to the page. So
you scroll in, go through all twenty-two, and scroll out, and the section
never holds you longer than it has posters. Nothing is pinned, and the page
is never taller than it looks. An earlier version pinned this section for
eleven screens, which is exactly the thing a portfolio should not do to
someone skimming.

Two guards make that honest: at either end the wheel is handed straight back,
and a wheel event arriving within 200ms of a page scroll is ignored — so the
rail sliding up under your cursor mid-flick can never steal the rest of it.

A mouse notch advances one poster, glided; a trackpad or a phone moves it
directly at whatever speed you push. You can also click any poster you can
see to bring it to the centre, or a tick underneath to jump. Cards turn away
from you at the edges and face you at the centre — the only thing driven per
frame, and driven by the rail's own scrollLeft, never the page's.

**Opening one.** The record is *the same poster, grown*: same frame, same
WANTED head, same corner stamp, with everything the small sheet had no room
for printed underneath — problem, approach, the notices grid, the diagram,
the stack. It grows out of the card you clicked: the card's rect is measured,
the sheet is mapped back onto it with one transform, and it travels from
there. A real FLIP, so it reads as the poster opening rather than a panel
arriving. Escape, Close, or the ground around it closes it, running the same
move backwards.

GitHub is one choice inside the record, never automatic.

### 04 · Skills — barcode bands
One band per group, one bar per tool, bars growing from the baseline as the
section arrives. Deliberately **not a chart**: there is no proficiency number
anywhere on this site, so the bars carry texture and the names underneath
carry the information. Inventing a percentage to fill a bar is the easiest
lie in a portfolio and this section refuses it.

### 05 · Contact
The email at display size, links as small caps. End.

## Navigation

**Five dots fixed to the right edge.** The current one fills and grows; its
label appears beside it. That is the entire navigation.

Two things follow: it works on a phone with no hamburger, and it doubles as a
position indicator, so where you are on the page is always visible.

## The quiet half

**All the ambition goes into `/`. Everything else is deliberately plain.**

Sites that animate everywhere feel cheap precisely because nothing is
distinguished — and it is also most of the answer to why a page is fast:
there is simply less running.

| Route | State | What it is |
|---|---|---|
| `/` | built | the five sections |
| `/work/<id>` | not built | one project, as a plain fast document |
| `/colophon` | not built | credits, licences, privacy |

Detail pages get **no canvas and no scroll machinery** — CSS entry
transitions and view transitions only, both free, both zero JavaScript.

Nothing links out automatically any more — the record opens in place and
GitHub is a choice inside it. Detail pages, if they are ever built, are for
people arriving from a link, not for people already on the deck.


## 04 · The field

One fixed canvas behind the entire page, at `z-index: -1`. It carries two
sets of dots.

**The lattice** is computed in screen space and never moves: a faint, even
screen behind everything, so there is always something for the torch to light
between sections.

**The picture** is a halftone screen of a fixed size — 68 × 90 cells, always
the same cells. What changes between sections is only each cell's *radius*
and *colour*, which is exactly how a real halftone encodes an image. So one
picture does not fade into the next: **the dots stay where they are and
resize, and the screen redraws itself into the next thing.** That is the only
transition on this site that could not be done with anything but dots.

Each section owns a **slot** — an empty box that says where the picture should
sit. The screen is mapped through a rectangle interpolated between the slot
you are leaving and the one you are arriving at, so the picture travels up the
page as well as changing. Because the cell pitch is a fraction of that
rectangle's width, a picture landing in a small slot gets finer: it resolves
as it shrinks.

| Slot | What it shows |
|---|---|
| `hero-slot` | the photograph, full height on the right |
| `about-slot` | the photograph, landing in the projector's beam |
| `work-slot` | the mark of whichever poster is live on the rail |
| `skills-slot` | the barcode, at section scale |
| `contact-slot` | the name, in Telugu |

The work slot changes *within* a section as you scroll the rail, so it has a
second, shorter cross-fade of its own — same mechanism, radii only. The rail
publishes the live project through `lib/field.ts`, a four-line store, rather
than lifting it into React state and re-rendering twenty-two posters every
time the rail nudges.

Cost per frame: one interpolation pass and two batched fills — one path, one
fill, however many dots — plus the few hundred inside the torch, and only on
frames where the scroll position or the pointer actually moved. It rides the
shared ticker in `lib/dots`, so there is still exactly one
requestAnimationFrame loop.

The torch is a hover effect, so on touch it does not exist and the field is a
plain monochrome halftone. The morphing still works there, because it is
driven by scroll.

**Still open:** the Skills enclosure itself, and what the Contact section is.
Both have proposals out; the field is settled either way, because the barcode
and the sign-off are drawn procedurally from the same data the section uses.
