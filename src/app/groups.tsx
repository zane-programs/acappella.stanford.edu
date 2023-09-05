// Group Pages
import FleetStreet from "./components/group-pages/FleetStreet";
import Harmonics from "./components/group-pages/Harmonics";
import Counterpoint from "./components/group-pages/Counterpoint";
import EverydayPeople from "./components/group-pages/EverydayPeople";
import Mendicants from "./components/group-pages/Mendicants";
import Raagapella from "./components/group-pages/Raagapella";
import OTone from "./components/group-pages/OTone";
import Testimony from "./components/group-pages/Testimony";
import Talisman from "./components/group-pages/Talisman";
import MixedCompany from "./components/group-pages/MixedCompany";

export interface ACappellaGroup {
  name: string;
  tagline: string;
  description: React.ReactNode;
  imgUrl: string;
  siteLink: string;
  // ADD THIS once your group has a live audition link
  auditionLink?: string;
  // Optional: extra keywords for SEO
  extraKeywords?: string[];
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
    description: <Mendicants />,
    imgUrl: "/assets/img/mendicants.jpg",
    siteLink: "https://www.stanfordmendicants.com/",
  },
  counterpoint: {
    name: "Counterpoint",
    tagline: "Stanford's only soprano/alto a cappella group",
    description: <Counterpoint />,
    imgUrl: "/assets/img/counterpoint.jpg",
    siteLink: "https://counterpointacappella.com/",
  },
  harmonics: {
    name: "Harmonics",
    tagline: "Stanford's rock/experimental a cappella group",
    description: <Harmonics />,
    imgUrl: "/assets/img/harmonics.jpg",
    siteLink: "https://www.stanfordharmonics.com/",
    extraKeywords: ["harmz", "stanford harmz"],
  },
  raagapella: {
    name: "Raagapella",
    tagline: "Stanford's all-gender South Asian Fusion a cappella group",
    description: <Raagapella />,
    imgUrl: "/assets/img/raagapella.jpg",
    siteLink: "https://www.raagapella.com/",
  },
  "o-tone": {
    name: "O-Tone",
    tagline: "Stanford's all-gender East Asian a cappella group",
    description: <OTone />,
    imgUrl: "/assets/img/o-tone.jpg",
    siteLink: "https://stanfordotone.com/",
    extraKeywords: ["otone", "stanford otone"],
  },
  "everyday-people": {
    name: "Everyday People",
    tagline: "Stanford's only hip-hop, Motown, R&B, and soul a cappella group",
    description: <EverydayPeople />,
    imgUrl: "/assets/img/everyday-people.jpg",
    siteLink: "https://linktr.ee/stanfordeverydaypeople",
    extraKeywords: ["ep", "stanford ep"],
  },
  testimony: {
    name: "Testimony",
    tagline: "Stanford's Christian co-ed a cappella group",
    description: <Testimony />,
    imgUrl: "/assets/img/testimony.jpg",
    siteLink: "https://testimonyacappella.weebly.com/",
  },
  talisman: {
    name: "Talisman",
    tagline: "A group of people singing music hailing from around the world",
    description: <Talisman />,
    imgUrl: "/assets/img/talisman.jpg",
    siteLink: "http://www.stanfordtalisman.com/",
  },
  "mixed-company": {
    name: "Mixed Company",
    tagline:
      "Stanford University's oldest all-gender, all-genre a cappella group",
    description: <MixedCompany />,
    imgUrl: "/assets/img/mixed-company.jpg",
    siteLink: "https://www.mixedco.com/",
    extraKeywords: ["mixed co", "mixedco", "mixed-co", "stanford mixed co"],
  },
};

export default GROUPS;
