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
      "Marvel in one hand, Tollywood in the other, and no interest whatsoever in defending either.",
    groups: [
      {
        title: "The side I picked",
        picks: [
          {
            t: "Marvel",
            w: "All of it. In a Marvel versus DC argument I do not participate, I just leave.",
            tag: "allegiance",
            star: true,
          },
          {
            t: "DC",
            w: "Not for me. We can still be friends about it.",
            tag: "declined",
          },
        ],
      },
      {
        title: "Mahesh Babu",
        note: "The filmography I could recite from memory, unprompted, and have.",
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
            w: "An absolute character in this one. The whole film sits on it.",
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
            w: "Not a film I watch — a button I press when I need my heart rate up. Rewatched more times than is reasonable.",
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
      ["Marvel or DC", "Marvel. Next question."],
      ["Preferred venue", "A full Telugu theatre"],
      ["Mahesh, Prabhas, Nani", "Do not make me rank them"],
      ["Salaar rewatches", "Lost count, on purpose"],
    ],
    take:
      "A three-hour Telugu film in a packed theatre is a live event, not a screening. Everything else is just watching something.",
    caller: {
      who: "Caller 01",
      q: "“He has recited the entire Mahesh Babu filmography, unprompted, more than once.” — a friend, correctly",
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
            w: "The one. Nothing from that whole era comes close, and I will not be talked down from this.",
            tag: "untouchable",
            star: true,
          },
          {
            t: "Power Rangers",
            w: "The gateway drug. Morphing sequences committed permanently to memory.",
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
            w: "A forever spot. Nothing is taking it, and nothing has come close to trying.",
            tag: "immovable",
            star: true,
          },
        ],
      },
      {
        title: "The three that stuck",
        note: "Not the rare picks. The ones that actually did something.",
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
      ["Niche credentials", "Deliberately none"],
      ["Shows that changed something", "Three, and they are not moving"],
    ],
    take:
      "Yes, those three are the big ones. I love them for what they mean to me, not for how few other people have heard of them — being a niche anime fan was never the point.",
    caller: {
      who: "Caller 02",
      q: "“Put Ryukendo on one more time.” — a childhood, repeatedly",
    },
  },

  /* ── 96.4 ─────────────────────────────────────────────── */
  {
    freq: "96.4",
    name: "Motorhead",
    glyph: "Motorhead",
    sub: "Driving it beats reading about it",
    pitch:
      "I would rather be on the thing than reading about the thing. Cruisers, manual boxes, and the long way round.",
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
            w: "Boys’ trips, real distance, and a standing plan to do considerably more of them.",
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
            w: "The GOAT choice. This is not a discussion, it is a position.",
            tag: "non-negotiable",
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
        note: "Not a spec-sheet obsessive. These just look right.",
        chips: [
          "Porsche",
          "Mercedes-Benz",
          "Vintage classics",
          "American muscle",
        ],
        picks: [
          {
            t: "A rugged jeep",
            w: "Over every single thing listed above. The Pajero Sport sort — old-school Indian road presence, zero subtlety.",
            tag: "above all",
            star: true,
          },
        ],
      },
    ],
    specs: [
      ["Gearbox", "Manual, obviously"],
      ["Favourite class", "Cruiser"],
      ["Behind the wheel", "New, and enthusiastic"],
      ["Above everything", "A rugged jeep"],
    ],
    take:
      "Car people argue about numbers. I would rather have the long route, a manual box and the right song at the right moment.",
    caller: {
      who: "Caller 03",
      q: "“He took the longer road again.” — everyone in the car",
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
            w: "I have lost count. Not “I stopped counting” — genuinely cannot say. And I am still watching it now.",
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
      "It is built out of people being wrong in ways that are recognisable rather than cruel, which is rarer than it sounds and is exactly why it survives the fourth pass.",
    caller: {
      who: "Caller 04",
      q: "“Is this the one where—” “Yes.” — every single time",
    },
  },

  /* ── 104.5 ────────────────────────────────────────────── */
  {
    freq: "104.5",
    name: "Music",
    glyph: "Music",
    sub: "Rock loud, Telugu classic, One Direction forever",
    pitch:
      "Bass-boosted, one notch too loud, and largely the same handful of things for years.",
    groups: [
      {
        title: "Loud",
        note: "For the hype, and for anything that has to be done at volume.",
        picks: [
          {
            t: "Linkin Park",
            w: "The loud half of everything. Formative, and I am not apologising for it.",
            tag: "the loud half",
            star: true,
          },
          { t: "Skillet", w: "Same job, different accent.", tag: "hype" },
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
      "One Direction is not a guilty pleasure. Drop the guilty and the sentence still works fine.",
    caller: {
      who: "Caller 05",
      q: "“He has had the same five artists on since school.” — a friend, also correctly",
    },
  },

  /* ── 108.0 ────────────────────────────────────────────── */
  {
    freq: "108.0",
    name: "Mutts and Meows",
    glyph: "Mutts and Meows",
    sub: "Started with a cartoon dog, never recovered",
    pitch:
      "A film about a dog who thinks he is a superhero did this to me, and I regret none of it.",
    invert: true,
    groups: [
      {
        title: "The two camps",
        picks: [
          {
            t: "Dogs",
            w: "The original cause. Bolt is entirely responsible and has never been held accountable.",
            tag: "blame Bolt",
            star: true,
          },
          {
            t: "Cats",
            w: "Arrived later and argued their way in, which is very much their method.",
            tag: "earned it",
          },
        ],
      },
    ],
    specs: [
      ["Origin story", "A cartoon dog, 2008"],
      ["Team", "Both. Do not make me choose."],
      ["Currently", "—"],
      ["Given the chance", "Immediately"],
    ],
    take:
      "Every interest on this page can be traced back to something I watched. This one just happens to be about an animal, and it stuck harder than any of them.",
  },
];
