// Resolve a public/ asset against the Vite base URL so the site works
// both at the domain root and under a GitHub Pages project path.
export const asset = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

export interface Track {
  id: string;
  title: string;
  file: string;
  bpm: number;
  collab?: string;
  priceTag: string;
}

export const TRACKS: Track[] = [
  {
    id: "01",
    title: "DELPHINE",
    file: asset("audio/delphine.mp3"),
    bpm: 154,
    priceTag: "$10/$30/$100",
  },
  {
    id: "02",
    title: "DO-YOU-SEE-ME",
    file: asset("audio/do-you-see-me.mp3"),
    bpm: 140,
    collab: "9ANYAL",
    priceTag: "$10/$30/$100",
  },
  {
    id: "03",
    title: "FUNERAL",
    file: asset("audio/funeral.mp3"),
    bpm: 145,
    priceTag: "$10/$30/$100",
  },
  {
    id: "04",
    title: "TOKYO",
    file: asset("audio/tokyo.mp3"),
    bpm: 130,
    collab: "FRQXENCY",
    priceTag: "$10/$30/$100",
  },
  {
    id: "05",
    title: "DILEMMA",
    file: asset("audio/dilemma.mp3"),
    bpm: 144,
    collab: "9ANYAL",
    priceTag: "$10/$30/$100",
  },
];

export const LINKS = {
  discord: "https://discord.com/users/824121463971905557",
  instagram: "https://www.instagram.com/deleted_formatt/",
  // ig.me/m/... opens a DM thread directly (instagram profile URLs ignore ?text=)
  instagramDm: "https://ig.me/m/deleted_formatt",
  soundcloud: "https://soundcloud.com/deleted-947955106",
  untitled: "https://untitled.stream/library/project/sTAvnLT4cGPGWBUaLImPw",
  email: "deletedroot@gmail.com",
};

// Instagram has no message-prefill URL scheme, so we deep-link straight
// into the DM thread; `what` is kept for a future channel that supports it.
export const orderDm = (_what: string) => LINKS.instagramDm;
