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
    file: "/audio/delphine.mp3",
    bpm: 154,
    priceTag: "$10/$30/$100",
  },
  {
    id: "02",
    title: "DO-YOU-SEE-ME",
    file: "/audio/do-you-see-me.mp3",
    bpm: 140,
    collab: "9ANYAL",
    priceTag: "$10/$30/$100",
  },
  {
    id: "03",
    title: "FUNERAL",
    file: "/audio/funeral.mp3",
    bpm: 145,
    priceTag: "$10/$30/$100",
  },
  {
    id: "04",
    title: "TOKYO",
    file: "/audio/tokyo.mp3",
    bpm: 130,
    collab: "FRQXENCY",
    priceTag: "$10/$30/$100",
  },
  {
    id: "05",
    title: "WISH-FOR-EVER",
    file: "/audio/wish-forever.mp3",
    bpm: 129,
    collab: "ALX",
    priceTag: "$10/$30/$100",
  },
];

export const LINKS = {
  discord: "https://discord.com/users/824121463971905557",
  instagram: "https://www.instagram.com/deleted_formatt/",
  soundcloud: "https://soundcloud.com/deleted-947955106",
  untitled: "https://untitled.stream/library/project/sTAvnLT4cGPGWBUaLImPw",
  email: "deletedroot@gmail.com",
};

export const orderDm = (what: string) => {
  const text = `hi DELETEDROOT! i want to order: ${what}`;
  return `${LINKS.instagram}?text=${encodeURIComponent(text)}`;
};
