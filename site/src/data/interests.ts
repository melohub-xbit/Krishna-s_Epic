/**
 * ─────────────────────────────────────────────────────────────
 *  THE BAND — six stations on the personal frequency.
 * ─────────────────────────────────────────────────────────────
 *
 *  The scene between Skills and Contact tunes across these; the
 *  /interests route lists them properly. Order is the order they
 *  sit on the dial, low to high, so changing it moves them on the
 *  scale — keep it deliberate.
 *
 *  ⚠ Music is yours — the bands and artists you named. Anime,
 *  Cars and Bikes are POPULAR STAND-INS so the page has something
 *  in it; swap them for your actual picks. Anything still "—" is
 *  a blank nobody has filled, and it renders as a dash rather than
 *  as something invented. Nothing here is load-bearing for layout,
 *  so the paragraphs can be any length.
 */

export type Interest = {
  /** where it sits on the dial */
  freq: string;
  name: string;
  te: string;
  /** the one line under the dial while it is tuned in */
  sub: string;
  /** the paragraph on the route */
  long: string;
  /** the spec rows on the route — "—" for anything not filled in */
  facts: [string, string][];
};

export const INTERESTS: Interest[] = [
  {
    freq: "88.2",
    name: "Hackathons",
    te: "పోటీలు",
    sub: "36 hours, one idea, no sleep",
    long:
      "The fastest way I know to find out whether an idea survives contact with a deadline. Most of what I have built that I still like started as something that had to work by morning — the constraint does the editing for you. I take whatever role is missing on the team, which has meant frontend more often than I expected.",
    facts: [
      ["Format", "36 hours, in person"],
      ["Best finish", "2nd of 5,600+"],
      ["Role", "Whatever is missing"],
      ["Since", "—"],
    ],
  },
  {
    freq: "92.7",
    name: "Music",
    te: "సంగీతం",
    sub: "Linkin Park to Keeravani, in the same afternoon",
    long:
      "Two halves that do not obviously belong together. Linkin Park and One Direction are what I grew up with in English — the first loud, the second unembarrassed, and I will not be apologising for either. The other half is home: Anirudh Ravichander for anything that has to move, Sai Abhyankar for the newer sound, and M. M. Keeravani for the writing that outlasts the film it was written for.",
    facts: [
      ["Bands", "Linkin Park · One Direction"],
      ["Artists", "Anirudh Ravichander"],
      ["Also", "Sai Abhyankar · Keeravani"],
      ["Format", "Wired, always"],
    ],
  },
  {
    freq: "96.1",
    name: "Anime",
    te: "యానిమే",
    sub: "Long arcs, subs, and one rewatch too many",
    long:
      "A long-arc person rather than a season-at-a-time one — the shows worth the time are the ones that spend a hundred episodes earning something and then collect on it. Subs, always; a lot of the performance is in the voice.",
    facts: [
      ["Watching", "One Piece"],
      ["Best arc", "Attack on Titan"],
      ["Would show a sceptic", "Death Note"],
      ["Subs or dubs", "Subs"],
    ],
  },
  {
    freq: "101.4",
    name: "Cars",
    te: "కార్లు",
    sub: "The engineering first, the sound second",
    long:
      "The interest is mechanical before it is aesthetic — what a car is doing, why it is laid out the way it is, and what a manufacturer gave up to get there. Reading a spec sheet is most of the fun, which is probably the same instinct that makes the rest of this site look like one.",
    facts: [
      ["Draw", "Engineering"],
      ["Would keep forever", "Porsche 911"],
      ["Follows", "Formula 1"],
      ["Drives", "—"],
    ],
  },
  {
    freq: "104.8",
    name: "Bikes",
    te: "బైక్‌లు",
    sub: "City and highway, full gear",
    long:
      "A different interest from cars, not the same one scaled down. A bike is the smallest complete machine you can be responsible for, and you feel every decision the designer made. Full gear every time, without a debate about it.",
    facts: [
      ["Follows", "MotoGP"],
      ["Terrain", "City and highway"],
      ["Gear", "Full, always"],
      ["Rides", "—"],
    ],
  },
  {
    freq: "108.0",
    name: "Tollywood",
    te: "సినిమా",
    sub: "Telugu cinema, in the theatre",
    long:
      "Telugu is my first language and this is where I hear it loudest. First-day-first-show is a different experience from watching anything at home, and it is the one thing on this list that is not solitary.",
    facts: [
      ["Language", "Telugu"],
      ["Watches", "In the theatre"],
      ["Favourite", "—"],
      ["First show", "—"],
    ],
  },
];
