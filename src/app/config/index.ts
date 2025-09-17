interface IConfig {
  showAuditionButtons: boolean;
  groupAltNameMappings: { [from: string]: string };
}

const CONFIG: IConfig = {
  showAuditionButtons: true,
  groupAltNameMappings: {
    fs: "/fleet-street",
    fleetstreet: "/fleet-street",
    harmz: "/harmonics",
    ep: "/everyday-people",
    otone: "/o-tone",
  },
};

export default CONFIG;
