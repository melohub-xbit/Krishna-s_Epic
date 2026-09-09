/**
 * ─────────────────────────────────────────────────────────────
 *  THE M BAND — six stations, and every one of them an M.
 * ─────────────────────────────────────────────────────────────
 *
 *  FM was the joke waiting to be made: the section is a tuner and
 *  everything worth putting on it happened to start with M. Six
 *  stops, evenly spaced from 88.2 to 108.0 so the dial travels its
 *  whole length.
 *
 *  Two card shapes, on purpose:
 *    CHIPS  — a name and nothing else, for a list that is long
 *             because the list itself is the point.
 *    PICKS  — a card with a line under it, for the handful that
 *             actually carry a feeling.
 *  Everything gets a chip; only the ones worth stopping on get a
 *  pick. A wall of forty witty captions is a wall nobody reads.
 *
 *  `invert` flips a station onto cream. Alternating is deliberate:
 *  the route is long, and a dark page that never changes ground
 *  reads as one very tall section.
 */

export type Pick = {
  t: string;
  /** the one line under it */
  w: string;
  tag?: string;
  /** the cream card — one per group at most, or it stops meaning anything */
  star?: boolean;
};

export type Group = {
  title: string;
  note?: string;
  chips?: string[];
  picks?: Pick[];
  /** the loud one — bigger type, accent rule, used sparingly */
  spotlight?: boolean;
};

export type Interest = {
  /** where it sits on the dial */
  freq: string;
  name: string;
  /** the painter key in data/glyphs.ts */
  glyph: string;
  /** the one line under the dial while it is tuned in */
  sub: string;
  /** the italic line at the top of the station on the route */
  pitch: string;
  groups: Group[];
  /** the joke spec sheet — "—" renders as a blank, not as an invention */
  specs: [string, string][];
  /** the closing line — why it stuck, not an argument to be had */
  take: string;
  caller?: { who: string; q: string };
  /** cream ground instead of dusk */
  invert?: boolean;
};

export const INTERESTS: Interest[] = [
  /* ── 88.2 ─────────────────────────────────────────────── */
  {
    freq: "88.2",
    name: "Movies",
    glyph: "Movies",
    sub: "Marvel over DC, Tollywood over almost everything",
    pitch:
      "Marvel in one hand, Tollywood in the other, and a full theatre if I can get one.",
    groups: [
      {
        title: "Marvel",
        picks: [
          {
            t: "Marvel",
            w: "All of it, and gladly. The whole run, the crossovers, the ones I have seen too many times.",
            tag: "the whole run",
            star: true,
          },
        ],
      },
      {
        title: "Mahesh Babu",
        note: "My favourites of his, more or less in the order I came to them.",
        chips: [
          "Murari",
          "Pokiri",
          "Khaleja",
          "Businessman",
          "Athadu",
          "Athidhi",
          "Dookudu",
          "Aagadu",
          "1 — Nenokkadine",
          "Varanasi (soon)",
        ],
        picks: [
          {
            t: "Seethamma Vaakitlo Sirimalle Chettu",
            w: "An absolute character in this one. My favourite thing he has done.",
            tag: "the performance",
            star: true,
          },
        ],
      },
      {
        title: "Prabhas · the Darling era",
        note: "The old rebel, before any of it went global.",
        chips: [
          "Billa",
          "Darling",
          "Pournami",
          "Chatrapathi",
          "Bujjigadu",
          "Mirchi",
        ],
      },
      {
        title: "Prabhas · the global ascent",
        note: "Same man, entirely different decade.",
        chips: ["Baahubali", "Saaho", "Kalki"],
        picks: [
          {
            t: "Salaar",
            w: "My go-to when I want the adrenaline. I have put this one on more times than I can count.",
            tag: "adrenaline",
            star: true,
          },
        ],
      },
      {
        title: "Nani",
        note: "My go-to funny guy, old era and new.",
        chips: [
          "Pilla Zamindar",
          "Eega",
          "Ninnu Kori",
          "Gang Leader",
          "Devadas",
          "Tuck Jagadish",
          "Ante Sundaraniki",
          "Saripodhaa Sanivaaram",
          "HIT 3",
          "Paradise (soon)",
        ],
      },
      {
        title: "And these",
        chips: ["KGF Chapter 1", "KGF Chapter 2", "Don"],
      },
    ],
    specs: [
      ["Comfort genre", "Action, and a full house"],
      ["Preferred venue", "A full Telugu theatre"],
      ["Three favourites", "Mahesh, Prabhas, Nani"],
      ["Salaar rewatches", "Lost count"],
    ],
    take:
      "A three-hour Telugu film in a packed theatre is the best time I have. The whistles, the interval, all of it.",
    caller: {
      who: "Caller 01",
      q: "“He can name every one of them in order.” — a friend, and fair enough",
    },
  },

  /* ── 92.1 ─────────────────────────────────────────────── */
  {
    freq: "92.1",
    name: "Moving Pictures",
    glyph: "Moving Pictures",
    sub: "Cartoons first, anime second, no gap in between",
    pitch:
      "It started with a cartoon dog and it has not stopped since. Two phases, one habit.",
    invert: true,
    groups: [
      {
        title: "Phase one · the cartoons",
        picks: [
          {
            t: "Bolt",
            w: "The first one, watched on loop. Also the reason I ended up a cat-and-dog person at all — see the last station.",
            tag: "patient zero",
            star: true,
          },
        ],
        chips: ["Cars", "Toy Story", "Monsters, Inc."],
      },
      {
        title: "Saturday morning, in costume",
        note: "The tokusatsu years, and they get their own heading for a reason.",
        spotlight: true,
        picks: [
          {
            t: "Ryukendo",
            w: "My favourite thing from that whole era. Still is.",
            tag: "the favourite",
            star: true,
          },
          {
            t: "Power Rangers",
            w: "How it started. I still know the morphing sequences by heart.",
            tag: "the gateway",
          },
        ],
      },
      {
        title: "The bridge",
        note: "Japanese, but still Saturday-morning. This is where it turned.",
        chips: [
          "Beyblade",
          "Pokémon",
          "Digimon",
          "Bakugan",
          "Doraemon",
          "Shin-chan",
        ],
      },
      {
        title: "Phase two · the old elites",
        note: "Naruto and Dragon Ball first. Everything else followed them in.",
        chips: [
          "Naruto",
          "Dragon Ball",
          "One Piece",
          "Bleach",
          "Hunter × Hunter",
          "Assassination Classroom",
          "My Hero Academia",
        ],
      },
      {
        title: "The new generation",
        chips: ["Death Note", "Demon Slayer", "Black Clover", "Jujutsu Kaisen"],
      },
      {
        title: "Slice of life, and the ones that hurt",
        chips: [
          "Grand Blue Dreaming",
          "Suzume",
          "Your Lie in April",
          "Your Name",
        ],
      },
      {
        title: "Permanent residents",
        chips: ["Gintama", "Haikyuu!!", "Howl’s Moving Castle", "One Punch Man"],
        picks: [
          {
            t: "Attack on Titan",
            w: "A forever spot on this list. One of my favourite things I have watched.",
            tag: "forever",
            star: true,
          },
        ],
      },
      {
        title: "The three that stuck",
        note: "The three I keep coming back to.",
        spotlight: true,
        picks: [
          { t: "One Piece", w: "Still going. So am I.", tag: "the long one" },
          { t: "Naruto", w: "The first, and the one everything is measured against.", tag: "the first" },
          { t: "My Hero Academia", w: "Landed at exactly the right time.", tag: "the timing" },
        ],
      },
    ],
    specs: [
      ["First ever", "Bolt, on loop"],
      ["Subs or dubs", "Subs"],
      ["Picks", "Happily mainstream"],
      ["Closest to me", "Three of them"],
    ],
    take:
      "Those three are the big ones, and that is fine by me. I love them for what they mean to me rather than for how rare they are.",
    caller: {
      who: "Caller 02",
      q: "“One more episode.” — me, at eleven, every evening",
    },
  },

  /* ── 96.4 ─────────────────────────────────────────────── */
  {
    freq: "96.4",
    name: "Motorhead",
    glyph: "Motorhead",
    sub: "Driving it beats reading about it",
    pitch:
      "I like being on the thing more than reading about it. Cruisers, manual boxes, and the long way round.",
    groups: [
      {
        title: "Two wheels",
        picks: [
          {
            t: "Cruisers",
            w: "The favourite, easily. Sit back, low revs, nowhere in particular to be.",
            tag: "the pick",
            star: true,
          },
          {
            t: "Long rides",
            w: "Boys’ trips, real distance, and a standing plan to do a lot more of them.",
            tag: "done, and doing",
          },
        ],
        chips: ["Royal Enfield", "Sports bikes", "Anything I have not ridden"],
      },
      {
        title: "Four wheels",
        picks: [
          {
            t: "Manual transmission",
            w: "My favourite way to drive. Always will be.",
            tag: "the favourite",
            star: true,
          },
          {
            t: "The old Maruti Suzuki Ritz",
            w: "Ours, and where I learned what a car actually does.",
            tag: "the family car",
          },
          {
            t: "Kia Carens",
            w: "The current one.",
            tag: "now",
          },
          {
            t: "A good drive playlist",
            w: "Half the reason to take the longer route.",
            tag: "mandatory",
          },
        ],
      },
      {
        title: "Followed from a distance",
        note: "The ones I like looking at.",
        chips: [
          "Porsche",
          "Mercedes-Benz",
          "Vintage classics",
          "American muscle",
        ],
        picks: [
          {
            t: "A rugged jeep",
            w: "My favourite of the lot. The Pajero Sport sort — that old-school Indian road presence.",
            tag: "the favourite",
            star: true,
          },
        ],
      },
    ],
    specs: [
      ["Gearbox", "Manual"],
      ["Favourite class", "Cruiser"],
      ["Behind the wheel", "New, and enthusiastic"],
      ["Favourite of all", "A rugged jeep"],
    ],
    take:
      "My favourite part of any of it is the drive itself — the long route, a manual box and the right song at the right moment.",
    caller: {
      who: "Caller 03",
      q: "“He took the longer road again.” — everyone in the car, and they were right",
    },
  },

  /* ── 100.3 ────────────────────────────────────────────── */
  {
    freq: "100.3",
    name: "Modern Family",
    glyph: "Modern Family",
    sub: "Still on. Still counting.",
    pitch:
      "The comfort show. Any time, any place, and — importantly — still going.",
    invert: true,
    groups: [
      {
        title: "The state of play",
        picks: [
          {
            t: "The rewatch",
            w: "I have genuinely lost count, and I am still watching it now.",
            tag: "ongoing",
            star: true,
          },
          {
            t: "Phil Dunphy",
            w: "A whole philosophy. One line of it opens this site, uncredited on purpose.",
            tag: "the source",
          },
          {
            t: "The Modern Family machine",
            w: "An actual plan: the whole series downloaded into one app that behaves like a television which only plays Modern Family.",
            tag: "in the works",
          },
        ],
      },
    ],
    specs: [
      ["Seasons", "All eleven"],
      ["Rewatch count", "Uncountable"],
      ["Currently", "Still watching"],
      ["Side project", "A TV that plays nothing else"],
    ],
    take:
      "It is built out of people being wrong in ways that are recognisable rather than cruel, and that is why it still lands on the fourth pass.",
    caller: {
      who: "Caller 04",
      q: "“Is this the one where—” “Yes.” — every time",
    },
  },

  /* ── 104.5 ────────────────────────────────────────────── */
  {
    freq: "104.5",
    name: "Music",
    glyph: "Music",
    sub: "Rock loud, Telugu classic, One Direction forever",
    pitch:
      "Bass-boosted, a notch too loud, and largely the same handful of things for years.",
    groups: [
      {
        title: "Loud",
        note: "For the hype, and for anything that has to be done at volume.",
        picks: [
          {
            t: "Linkin Park",
            w: "The loud half of everything, and the band I grew up on.",
            tag: "the loud half",
            star: true,
          },
          { t: "Skillet", w: "Same job, same volume.", tag: "hype" },
          {
            t: "Theme songs",
            w: "Anything written to make you feel like the main character of something.",
            tag: "main character",
          },
        ],
      },
      {
        title: "2 AM",
        note: "The other half — for focus in daylight and for the feels after midnight. Same playlist, different job.",
        chips: ["Vibey", "Catchy", "Nothing that demands attention"],
      },
      {
        title: "Telugu, 2000s and 2010s",
        note: "The soundtracks from every film two stations back, and the all-time hits.",
        chips: ["Non-stop", "No skips", "Word-perfect"],
      },
      {
        title: "One Direction",
        note: "Since 8th standard, after a specific incident I am not elaborating on here. Never stopped.",
        spotlight: true,
        picks: [
          { t: "Rock Me", w: "The favourite. It has never once been skipped.", tag: "the one", star: true },
          { t: "I Would", w: "A close second, and the one I actually sing.", tag: "runner-up" },
        ],
      },
    ],
    specs: [
      ["Headphones", "Beats Studio Pro, bass boosted"],
      ["Volume", "One notch too high"],
      ["Listening since", "8th standard"],
      ["Skip rate", "Suspiciously low"],
    ],
    take:
      "One Direction has been on since 8th standard and has never once come off. Easily my most-played.",
    caller: {
      who: "Caller 05",
      q: "“He has had the same five artists on since school.” — a friend, and true",
    },
  },

  /* ── 108.0 ────────────────────────────────────────────── */
  {
    freq: "108.0",
    name: "Meows and Bows",
    glyph: "Meows and Bows",
    sub: "Started with a cartoon dog, never recovered",
    pitch:
      "A film about a dog who thinks he is a superhero started this, and it never wore off.",
    invert: true,
    groups: [
      {
        title: "The two camps",
        picks: [
          {
            t: "Dogs",
            w: "Where it started. Bolt is entirely responsible.",
            tag: "thanks, Bolt",
            star: true,
          },
          {
            t: "Cats",
            w: "Came later, and just as much of a favourite now.",
            tag: "equally",
          },
        ],
      },
    ],
    specs: [
      ["Origin story", "A cartoon dog, 2008"],
      ["Team", "Both, equally"],
      ["Currently", "—"],
      ["Given the chance", "Immediately"],
    ],
    take:
      "Most things on this page started with something I watched. This one did too, and it turned into the softest spot I have.",
  },
];
