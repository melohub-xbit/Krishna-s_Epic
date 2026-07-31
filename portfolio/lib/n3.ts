/**
 * Round a generated coordinate to 3 decimal places.
 *
 * This is a HYDRATION FIX, not a tidiness preference. Raw floats serialise
 * differently on server and client at the last decimal, so any procedurally
 * generated SVG coordinate throws a React hydration mismatch. See
 * PROJECT-STATUS.md §4 gotcha 1 — it cost real time once already.
 *
 * Rule: every number that reaches an SVG attribute from a computation goes
 * through here. Literals in JSX are fine; anything with a Math.* in its
 * lineage is not.
 *
 * Previously a private const inside ornament/Motifs.tsx. Promoted when
 * components/ink needed it too — an invariant this load-bearing should have
 * exactly one definition.
 */
export const n3 = (n: number) => Number(n.toFixed(3));
