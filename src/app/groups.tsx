// Group Pages
import FleetStreet from "./components/group-pages/FleetStreet";

export interface ACappellaGroup {
  name: string;
  tagline: string;
  description: React.ReactNode;
  imgUrl: string;
  siteLink: string;
  // ADD THIS once your group
  auditionLink?: string;
}

const GROUPS: { [slug: string]: ACappellaGroup } = {
  "fleet-street": {
    name: "Fleet Street",
    tagline: "Stanford's all-gender, all-original comedy a cappella group",
    description: <FleetStreet />,
    imgUrl: "/assets/img/fleet-street.jpg",
    siteLink: "https://www.fleetstreet.com/",
    auditionLink: "https://www.fleetstreet.com/audition",
  },
  mendicants: {
    name: "Mendicants",
    tagline: "Stanford's oldest a cappella group",
    description: "Something about the Mendicants here",
    imgUrl: "/assets/img/mendicants.jpg",
    siteLink: "https://www.stanfordmendicants.com/",
  },
  counterpoint: {
    name: "Counterpoint",
    tagline: "Stanford's only soprano/alto a cappella group",
    description: "Something about Counterpoint here",
    imgUrl: "/assets/img/counterpoint.jpg",
    siteLink: "https://counterpointacappella.com/",
  },
  harmonics: {
    name: "Harmonics",
    tagline: "Stanford's rock/experimental a cappella group",
    description: "Something about Harmonics here",
    imgUrl: "/assets/img/harmonics.jpg",
    siteLink: "https://www.stanfordharmonics.com/",
  },
  raagapella: {
    name: "Raagapella",
    tagline: "Stanford's all-gender South Asian Fusion a cappella group",
    description: "Something about Raagapella here",
    imgUrl: "/assets/img/raagapella.jpg",
    siteLink: "https://www.raagapella.com/",
  },
  "o-tone": {
    name: "O-Tone",
    tagline: "Stanford's all-gender East Asian a cappella group",
    description: "Something about O-Tone here",
    imgUrl: "/assets/img/o-tone.jpg",
    siteLink: "https://stanfordotone.com/",
  },
  "everyday-people": {
    name: "Everyday People",
    tagline: "Stanford's only hip-hop, Motown, R&B, and soul a cappella group",
    description: "Something about EP here",
    imgUrl: "/assets/img/everyday-people.jpg",
    siteLink: "https://linktr.ee/stanfordeverydaypeople",
  },
  testimony: {
    name: "Testimony",
    tagline: "Stanford's Christian co-ed a cappella group",
    description: "Something about Testimony here",
    imgUrl: "/assets/img/testimony.jpg",
    siteLink: "https://testimonyacappella.weebly.com/",
  },
  talisman: {
    name: "Talisman",
    tagline: "A group of people singing music hailing from around the world",
    description: "Something about Talisman here",
    imgUrl: "/assets/img/talisman.jpg",
    siteLink: "http://www.stanfordtalisman.com/",
  },
  "mixed-company": {
    name: "Mixed Company",
    tagline:
      "Stanford University's oldest all-gender, all-genre a cappella group",
    description: "Something about Mixed Co here",
    imgUrl: "/assets/img/mixed-company.jpg",
    siteLink: "https://www.mixedco.com/",
  },
};

export default GROUPS;
