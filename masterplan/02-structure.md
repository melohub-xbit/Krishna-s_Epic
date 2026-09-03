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

### 01 · Entry
The wordmark resolves out of dots — కృష్ణ సాయి over KRISHNA SAI. One
statement line. Two facts: where he is, what he is doing. Then a quiet
pointer to the work.

No separate landing screen, no loader. This is section one of the scroll, so
there is no hand-off to get wrong.

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
