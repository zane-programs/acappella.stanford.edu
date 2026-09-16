interface IConfig {
  groupAltNameMappings: { [from: string]: string };
}

// Audition visibility is controlled by `ACTIVE_AUDITION_COHORT_ID` in
// `config/auditions.tsx`.
const CONFIG: IConfig = {
  groupAltNameMappings: {
    fs: "/fleet-street",
    fleetstreet: "/fleet-street",
    harmz: "/harmonics",
    ep: "/everyday-people",
    otone: "/o-tone",
    ctp: "/counterpoint",
    koletz: "/kol-etz",
  },
};

export default CONFIG;
