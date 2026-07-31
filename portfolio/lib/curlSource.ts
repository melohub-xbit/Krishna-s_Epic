/**
 * THE PAGE-CURL SHADER — an EXACT port of "SimpleBookCurl" by Raymond
 * Luckhurst (MIT), the gl-transition adaptation of Andrew Hung's page-curl:
 *   https://github.com/scriptituk/xfade-easing/blob/main/glsl/SimpleBookCurl.glsl
 *   https://andrewhungblog.wordpress.com/2018/04/29/page-curl-shader-breakdown/
 *
 * The body of `main()` below is the reference `transition()` line for line. The
 * only additions are the wrappers gl-transitions supplies for free
 * (`getFromColor`/`getToColor`, `progress`, `ratio`) and the horizontal mirror
 * used for a backward turn. Everything else — the phase split, the eased angle,
 * the back-face reflection, the shadow — is the reference's.
 *
 * ================================================================
 * WHY THE BOOK VARIANT, NOT THE PLAIN CURL
 * ================================================================
 * Andrew Hung's original curls ONE sheet across the whole screen. A book leaf
 * doesn't: it is hinged at the centre spine and has to roll OVER the spine and
 * lay down on the other half. SimpleBookCurl is the variant that does that, and
 * it does it by being an A -> B transition over the WHOLE book: `uFrom` is the
 * current spread (both pages), `uTo` is the next spread (both pages). Because A
 * already holds the destination on its left page and the source on its right,
 * turning A's right page over reproduces B exactly. The back face of the leaf is
 * reflected across the centre line (`* vec2(-1., 1.)`) — that reflection IS the
 * spine, and it is what maps the rolled page onto the left half.
 *
 * ================================================================
 * TWO BUGS THIS FILE EXISTS TO NOT HAVE AGAIN
 * ================================================================
 * 1. `asin(dist / rad)` MUST NOT BE CLAMPED. Clamping looks like obvious
 *    hardening and it is the cause of the grey streaked slab. In the reference, a
 *    fragment beyond the cylinder has dist > rad, so `dist / rad` exceeds 1 and
 *    asin returns NaN; both the `p2` and `p1` in-bounds tests then fail (every
 *    comparison against NaN is false) and the fragment correctly falls through to
 *    "on B". The NaN is load-bearing — it IS the off-the-cylinder test. Clamp it
 *    to PI/2 and every fragment on that whole half of the book instead maps to
 *    ONE vertical column of the destination texture, smeared sideways: a
 *    page-sized rectangle of horizontal streaks. That is the artefact, and no
 *    amount of mipmapping, anisotropy or shading fixes it, because nothing is
 *    aliasing — the sampling is simply wrong over a huge area. Rather than rely
 *    on NaN semantics, the branch here is guarded by an explicit `dist <= rad`
 *    region test, which is well defined and exactly equivalent.
 * 2. DON'T PAINT THE LEAF. An earlier attempt masked the streaks by blending the
 *    leaf toward paper and multiplying by a cosine "lit" term. With the striped
 *    area covering half the book, that read as a translucent grey frame over the
 *    page. The reference shades the leaf not at all: the back of the turning leaf
 *    shows B's content, because in a BOOK that back face genuinely is the next
 *    page. Whitening it (SimplePageCurl's `opacity`/`greyback`, which exist for
 *    the single-sheet case) would break the book model.
 *
 * `uRatio` is book width / height; the direction vector is aspect-corrected so
 * the curl axis reads as a real diagonal rather than skewing with the page
 * shape. `uAngle` (deg, 150) is the target lift angle, `uRadius` (0.1) the curl
 * tightness, `uShadow` (0.2) the contact-shadow EXPONENT — not a strength.
 */

export const CURL_VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // Standard [0,1] uv, y up. Texture uploads use UNPACK_FLIP_Y so the captured
  // pages (drawn top-down) still read upright under this convention — which is
  // the convention the ported transition math assumes.
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const CURL_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uFrom;   // current spread (both pages) — the page turning away
uniform sampler2D uTo;     // next spread (both pages) — revealed as it lands
uniform float uProgress;   // 0 = flat current, 1 = fully turned to next
uniform float uRatio;      // book width / height
uniform float uRadius;     // curl radius (tightness of the roll)
uniform float uShadow;     // contact-shadow exponent (reference default 0.2)
uniform float uAngle;      // target lift angle, degrees
uniform float uMirror;     // 1 = mirror horizontally: a BACKWARD turn lifts the LEFT page

const float M_PI = 3.14159265359;
const float M_PI_2 = 1.57079632679;

// A backward turn is the SAME curl, mirrored. The mirror has to be a change of
// coordinate system, not a tweak to the direction vector: flipping dir.x moves
// which CORNER the leaf hinges from (q is derived from the sign of dir) and
// leaves the vec2(-1., 1.) back-face reflection pointing the wrong way, which
// collapses the curl into a flat band. So the whole effect runs in a "curl
// space" where the right page always turns, and every texture read maps back to
// screen space through mirror(). mirror() is an involution and preserves [0,1],
// so the reference's in-bounds tests are untouched.
vec2 mirror(vec2 p) { return (uMirror > 0.5) ? vec2(1.0 - p.x, p.y) : p; }

vec4 getFromColor(vec2 uv) { return texture2D(uFrom, mirror(uv)); }
vec4 getToColor(vec2 uv)   { return texture2D(uTo, mirror(uv)); }

void main() {
  vec2 uv = mirror(vUv);
  float ratio = uRatio;
  float progress = uProgress;
  float radius = uRadius;
  float shadow = uShadow;

  /* ---- SimpleBookCurl, verbatim from here ---- */

  // setup
  float phi = radians(uAngle) - M_PI_2; // target curl angle
  vec2 dir = normalize(vec2(cos(phi) * ratio, sin(phi))); // direction unit vector
  vec2 q = vec2((dir.x >= 0.) ? 0.5 : -0.5, (dir.y >= 0.) ? 0.5 : -0.5); // quadrant corner
  vec2 i = abs(dir);
  float k = (i.x == 0.) ? M_PI_2 : atan(i.y, i.x); // absolute curl angle
  i = dir * dot(q, dir); // initial position, curl axis on corner
  float m1 = length(i); // length for rotating
  float m2 = M_PI * radius; // length of half-cylinder arc

  // get new angle & progress point
  float rad = radius; // working radius
  vec2 p; // working curl axis point
  float m = (m1 + m2) * progress; // current position along lengths
  if (m < m1) { // rotating page
    phi = k * (1. + cos(m / m1 * M_PI)) * .5; // eased new absolute curl angle
    dir = normalize(vec2(cos(phi), sin(phi)) * q); // new direction
    p = (m1 - m) * dir;
  } else { // straightening curl
    if (m2 > 0.)
      rad *= pow(1. - (m - m1) / m2, 2.); // eased new radius
    dir = vec2(q.x * 2., 0.); // new direction
    p = vec2(0., 0.);
  }

  // get point relative to curl axis
  i = uv - .5; // distance of current point from centre
  float dist = dot(i - p, dir); // distance of point from curl axis
  p = i - dir * dist; // point perpendicular to curl axis

  // map point to curl
  vec4 a = getFromColor(uv), b = getToColor(uv), c = b;
  bool s = false; // shadow flag
  if (dist < 0.) { // point is over flat A
    c = a;
    p = (p + dir * (M_PI * rad - dist)) * vec2(-1., 1.) + .5;
    if (p.x >= 0. && p.x <= 1. && p.y >= 0. && p.y <= 1.) // on flat back of A
      c = getToColor(p);
  } else if (rad > 0. && dist <= rad) { // curled A
    // NOTE: the "dist <= rad" guard is the ONE deviation from the reference, and
    // it is a no-op: upstream lets asin() go NaN here and relies on the bounds
    // tests below failing. See note 1 in the file header — do not replace it with
    // a clamp inside asin().
    // map to cylinder point
    phi = asin(dist / rad);
    vec2 p2 = (p + dir * (M_PI - phi) * rad) * vec2(-1., 1.) + .5;
    vec2 p1 = p + dir * phi * rad + .5;
    if (p2.x >= 0. && p2.x <= 1. && p2.y >= 0. && p2.y <= 1.) { // on curling back of A
      c = getToColor(p2);
      s = true;
    } else if (p1.x >= 0. && p1.x <= 1. && p1.y >= 0. && p1.y <= 1.) { // on curling front of A
      c = getFromColor(p1);
    } else { // on B
      s = true;
    }
  } else if (rad > 0.) { // past the free edge of the cylinder: on B
    s = true;
  }
  if (s && rad > 0.) // TODO(upstream): ok over A, makes a tideline over B for large radius
    c.rgb *= pow(clamp(abs(dist - rad) / rad, 0., 1.), shadow);

  /* ---- end SimpleBookCurl ---- */

  gl_FragColor = vec4(c.rgb, 1.0);
}
`;
