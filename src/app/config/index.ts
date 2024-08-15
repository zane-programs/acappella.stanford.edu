interface IConfig {
  showAuditionButtons: boolean;
  groupAltNameMappings: { [from: string]: string };
}

const CONFIG: IConfig = {
  showAuditionButtons: false,
  groupAltNameMappings: {
    fs: "/fleet-street",
    fleetstreet: "/fleet-street",
    harmz: "/harmonics",
    ep: "/everyday-people",
  },
};

export default CONFIG;
