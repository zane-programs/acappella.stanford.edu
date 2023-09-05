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

export interface GroupSocialLinks {
  instagram: string;
  youtube: string;
  spotify: string;
  appleMusic: string;
  tiktok: string;
  twitter: string;
  facebook: string;
}

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
  // Social media links
  socialLinks?: Partial<GroupSocialLinks>;
}

const GROUPS: { [slug: string]: ACappellaGroup } = {
  "fleet-street": {
    name: "Fleet Street",
    tagline: "Stanford's all-gender, all-original comedy a cappella group",
    description: <FleetStreet />,
    imgUrl: "/assets/img/fleet-street.jpg",
    siteLink: "https://www.fleetstreet.com/",
    auditionLink: "https://www.fleetstreet.com/audition",
    socialLinks: {
      youtube: "https://www.youtube.com/user/FleetStreetSingers",
      appleMusic:
        "https://music.apple.com/us/artist/stanford-fleet-street-singers/4165870",
      instagram: "https://www.instagram.com/thefleetstagram/",
      spotify: "https://open.spotify.com/artist/56MfXqkYeRrlMzLhBMg9CG",
      facebook: "https://www.facebook.com/StanfordFleetStreetSingers/",
    },
  },
  mendicants: {
    name: "Mendicants",
    tagline: "Stanford's oldest a cappella group",
    description: <Mendicants />,
    imgUrl: "/assets/img/mendicants.jpg",
    siteLink: "https://www.stanfordmendicants.com/",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/3ZBvLOZu5A9jtKO5XjHDTl",
      appleMusic:
        "https://music.apple.com/us/artist/the-stanford-mendicants/845314849",
      instagram: "https://www.instagram.com/the_mendicants/",
      tiktok: "https://www.tiktok.com/@the_mendicants",
      youtube: "https://www.youtube.com/user/StanfordMendicants",
      facebook: "https://www.facebook.com/mendicants/",
    },
  },
  counterpoint: {
    name: "Counterpoint",
    tagline: "Stanford's only soprano/alto a cappella group",
    description: <Counterpoint />,
    imgUrl: "/assets/img/counterpoint.jpg",
    siteLink: "https://counterpointacappella.com/",
    socialLinks: {
      youtube: "https://www.youtube.com/user/StanfordCPT",
      instagram: "https://www.instagram.com/stanfordcounterpoint/",
      spotify: "https://open.spotify.com/artist/4nZ5WW3me2FaE1IIEvE6bB",
      twitter: "https://twitter.com/su_counterpoint",
      facebook: "https://www.facebook.com/StanfordCounterpoint",
    },
  },
  harmonics: {
    name: "Harmonics",
    tagline: "Stanford's rock/experimental a cappella group",
    description: <Harmonics />,
    imgUrl: "/assets/img/harmonics.jpg",
    siteLink: "https://www.stanfordharmonics.com/",
    extraKeywords: ["harmz", "stanford harmz"],
    socialLinks: {
      spotify: "https://play.spotify.com/artist/528Rcthd9JqtIrlbrGKNsG",
      instagram: "http://instagram.com/stanfordharmonics/",
      youtube: "https://www.youtube.com/user/StanfordHarmonics",
      facebook: "https://www.facebook.com/theharmonics",
    },
  },
  raagapella: {
    name: "Raagapella",
    tagline: "Stanford's all-gender South Asian Fusion a cappella group",
    description: <Raagapella />,
    imgUrl: "/assets/img/raagapella.jpg",
    siteLink: "https://www.raagapella.com/",
    socialLinks: {
      instagram: "https://www.instagram.com/stanfordraagapella/",
      tiktok: "https://www.tiktok.com/@stanfordraagapella",
      youtube: "https://www.youtube.com/@StanfordRaagapella",
      spotify: "https://open.spotify.com/artist/7biaLUJ0zBroX0Wj4hfiU9",
      facebook: "https://www.facebook.com/StanfordRaagapella/",
      appleMusic:
        "https://music.apple.com/us/artist/stanford-raagapella/1104162044",
    },
  },
  "o-tone": {
    name: "O-Tone",
    tagline: "Stanford's all-gender East Asian a cappella group",
    description: <OTone />,
    imgUrl: "/assets/img/o-tone.jpg",
    siteLink: "https://stanfordotone.com/",
    extraKeywords: ["otone", "stanford otone"],
    socialLinks: {
      youtube: "https://www.youtube.com/channel/UCalFurLezFrabetPytEvVFQ",
      instagram: "https://www.instagram.com/stanfordotone",
      facebook: "https://www.facebook.com/StanfordOTone",
      spotify: "https://open.spotify.com/artist/6AHkKb8FrqJ0ZgxL40eoHk",
    },
  },
  "everyday-people": {
    name: "Everyday People",
    tagline: "Stanford's only hip-hop, Motown, R&B, and soul a cappella group",
    description: <EverydayPeople />,
    imgUrl: "/assets/img/everyday-people.jpg",
    siteLink: "https://linktr.ee/stanfordeverydaypeople",
    extraKeywords: ["ep", "stanford ep"],
    socialLinks: {
      instagram: "https://www.instagram.com/stanford_everydaypeople/",
      youtube: "https://www.youtube.com/user/StanfoEverydayPeople",
      twitter: "https://twitter.com/epacappella",
      facebook: "https://www.facebook.com/StanfordEverydayPeople/",
    },
  },
  testimony: {
    name: "Testimony",
    tagline: "Stanford's Christian co-ed a cappella group",
    description: <Testimony />,
    imgUrl: "/assets/img/testimony.jpg",
    siteLink: "https://testimonyacappella.weebly.com/",
    socialLinks: {
      youtube: "https://www.youtube.com/user/testimonyacappella",
      instagram: "https://www.instagram.com/testimonyacappella/",
      facebook: "https://www.facebook.com/testimonyacappella/",
      spotify: "https://open.spotify.com/artist/1Io1lNYlEkOHVzmSoDhBzm",
    },
  },
  talisman: {
    name: "Talisman",
    tagline: "A group of people singing music hailing from around the world",
    description: <Talisman />,
    imgUrl: "/assets/img/talisman.jpg",
    siteLink: "http://www.stanfordtalisman.com/",
    socialLinks: {
      youtube: "https://www.youtube.com/user/stanfordtalisman",
      facebook: "https://www.facebook.com/pages/Stanford-Talisman/6343264665",
      instagram: "http://instagram.com/stanfordtalisman/",
      twitter: "https://twitter.com/su_talisman",
      spotify: "https://open.spotify.com/artist/3UIMILG35CbsLIZU36eBWu",
    },
  },
  "mixed-company": {
    name: "Mixed Company",
    tagline:
      "Stanford University's oldest all-gender, all-genre a cappella group",
    description: <MixedCompany />,
    imgUrl: "/assets/img/mixed-company.jpg",
    siteLink: "https://www.mixedco.com/",
    extraKeywords: ["mixed co", "mixedco", "mixed-co", "stanford mixed co"],
    socialLinks: {
      youtube: "https://www.youtube.com/channel/UCbweG2JD_9iO50jWnQQnwAQ",
      facebook: "https://www.facebook.com/mixedco/",
      twitter: "https://twitter.com/mixedcompany",
      instagram: "https://www.instagram.com/stanfordmixedco/",
      appleMusic:
        "https://music.apple.com/us/artist/stanford-mixed-company/4165885",
      spotify: "https://open.spotify.com/artist/2W6zg3XdtRCYc7DStZTFAq",
    },
  },
};

export default GROUPS;
