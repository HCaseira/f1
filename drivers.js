class Driver extends ChampionshipEntry {
    constructor(args) {
        super(args);
        this._name = args.name ?? "John Doe";
        this._peakSkill = args.peakSkill ?? 5;
        this._currentSkill = args.currentSkill ?? 5;
        this._rainSpecialist = args.rainSpecialist ?? false;
        this._lapConsistency = args.lapConsistency ?? 5;
        this._raceConsistency = args.raceConsistency ?? 5;
        this._tyreManagement = args.tyreManagement ?? 5;
        this._overtaking = args.overtaking ?? 5;
        this._defense = args.defense ?? 5;
        this._errorProneness = args.errorProneness ?? 5;
        this._team = null;
    }

    get name() { return this._name; }
    get peakSkill() { return this._peakSkill; }
    get currentSkill() { return this._currentSkill; }
    get rainSpecialist() { return this._rainSpecialist; }
    get lapConsistency() { return this._lapConsistency; }
    get raceConsistency() { return this._raceConsistency; }
    get tyreManagement() { return this._tyreManagement; }
    get overtaking() { return this._overtaking; }
    get defense() { return this._defense; }
    get errorProneness() { return this._errorProneness; }
    get team() { return this._team; }
    set team(team) {
        if (this._team === team) {
            return;
        }
        if (this._team && this._team.driver1 === this) {
            this._team.driver1 = null;
        }
        if (this._team && this._team.driver2 === this) {
            this._team.driver2 = null;
        }
        this._team = team;
    }
}


const drivers = {
    sen: new Driver({
        name: "Ayrton Senna",
        peakSkill: 10, currentSkill: 10, rainSpecialist: true, tyreManagement: 6,
        lapConsistency: 8, raceConsistency: 7,
        overtaking: 8, defense: 9, errorProneness: 5,
    }),
    pro: new Driver({
        name: "Alain Prost",
        peakSkill: 9, currentSkill: 9, rainSpecialist: false, tyreManagement: 8,
        lapConsistency: 9, raceConsistency: 8,
        overtaking: 7, defense: 7, errorProneness: 1,
    }),

    ver: new Driver({
        name: "Max Verstappen",
        peakSkill: 10, currentSkill: 9, rainSpecialist: true, tyreManagement: 6,
        lapConsistency: 8, raceConsistency: 7,
        overtaking: 8, defense: 9, errorProneness: 3,
    }),
    per: new Driver({
        name: "Sergio Perez",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 7,
        lapConsistency: 6, raceConsistency: 4,
        overtaking: 6, defense: 7, errorProneness: 6,
    }),
    ham: new Driver({
        name: "Lewis Hamilton",
        peakSkill: 10, currentSkill: 7, rainSpecialist: true, tyreManagement: 6,
        lapConsistency: 8, raceConsistency: 6,
        overtaking: 8, defense: 8, errorProneness: 3,
    }),
    rus: new Driver({
        name: "George Russel",
        peakSkill: 8, currentSkill: 7, rainSpecialist: false, tyreManagement: 7,
        lapConsistency: 7, raceConsistency: 7,
        overtaking: 7, defense: 7, errorProneness: 5,
    }),
    lec: new Driver({
        name: "Charles Leclerc",
        peakSkill: 9, currentSkill: 8, rainSpecialist: false, tyreManagement: 6,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 6, defense: 6, errorProneness: 5,
    }),
    sai: new Driver({
        name: "Carlos Sainz",
        peakSkill: 7, currentSkill: 7, rainSpecialist: false, tyreManagement: 6,
        lapConsistency: 6, raceConsistency: 7,
        overtaking: 7, defense: 7, errorProneness: 3,
    }),
    nor: new Driver({
        name: "Lando Norris",
        peakSkill: 9, currentSkill: 8, rainSpecialist: false, tyreManagement: 6,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 7, defense: 5, errorProneness: 5,
    }),
    pia: new Driver({
        name: "Oscar Piastri",
        peakSkill: 9, currentSkill: 7, rainSpecialist: false, tyreManagement: 6,
        lapConsistency: 6, raceConsistency: 5,
        overtaking: 7, defense: 7, errorProneness: 2,
    }),
    alo: new Driver({
        name: "Fernando Alonso",
        peakSkill: 9, currentSkill: 7, rainSpecialist: false, tyreManagement: 7,
        lapConsistency: 8, raceConsistency: 7,
        overtaking: 9, defense: 9, errorProneness: 3,
    }),
    str: new Driver({
        name: "Lance Stroll",
        peakSkill: 6, currentSkill: 5, rainSpecialist: true, tyreManagement: 5,
        lapConsistency: 5, raceConsistency: 3,
        overtaking: 6, defense: 5, errorProneness: 8,
    }),
    gas: new Driver({
        name: "Pierre Gasly",
        peakSkill: 7, currentSkill: 7, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 7, defense: 7, errorProneness: 5,
    }),
    oco: new Driver({
        name: "Esteban Ocon",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 6,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 6, defense: 7, errorProneness: 5,
    }),
    alb: new Driver({
        name: "Alex Albon",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 6, defense: 7, errorProneness: 5,
    }),
    sar: new Driver({
        name: "Logan Sargeant",
        peakSkill: 5, currentSkill: 4, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 4, raceConsistency: 7,
        overtaking: 6, defense: 6, errorProneness: 7,
    }),
    col: new Driver({
        name: "Franco Colapinto",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 5, raceConsistency: 4,
        overtaking: 7, defense: 6, errorProneness: 7,
    }),
    tsu: new Driver({
        name: "Yuki Tsunoda",
        peakSkill: 7, currentSkill: 7, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 5,
        overtaking: 6, defense: 7, errorProneness: 5,
    }),
    ric: new Driver({
        name: "Daniel Ricciardo",
        peakSkill: 8, currentSkill: 5, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 4,
        overtaking: 9, defense: 6, errorProneness: 4,
    }),
    law: new Driver({
        name: "Liam Lawson",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 5, raceConsistency: 4,
        overtaking: 6, defense: 6, errorProneness: 5,
    }),
    bot: new Driver({
        name: "Valtteri Bottas",
        peakSkill: 7, currentSkill: 6, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 6, defense: 6, errorProneness: 3,
    }),
    zho: new Driver({
        name: "Zhou Guanyu",
        peakSkill: 6, currentSkill: 5, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 5, raceConsistency: 5,
        overtaking: 6, defense: 6, errorProneness: 4,
    }),
    hul: new Driver({
        name: "Nico Hulkenberg",
        peakSkill: 8, currentSkill: 7, rainSpecialist: false, tyreManagement: 5,
        lapConsistency: 6, raceConsistency: 6,
        overtaking: 7, defense: 6, errorProneness: 4,
    }),
    mag: new Driver({
        name: "Kevin Magnussen",
        peakSkill: 7, currentSkill: 5, rainSpecialist: false, tyreManagement: 7,
        lapConsistency: 6, raceConsistency: 4,
        overtaking: 7, defense: 9, errorProneness: 4,
    }),
};