class ChampionshipEntry {
    constructor() {
        this.races = 0;
        this.poles = 0;
        this.podiumns = 0;
        this.victories = 0;
        this.fastestLaps = 0;
        this.points = 0;
        this.bestResult = 100;
        this.dnfs = 0;

        this.seasonRaces = 0;
        this.seasonPoles = 0;
        this.seasonPodiumns = 0;
        this.seasonVictories = 0;
        this.seasonFastestLaps = 0;
        this.seasonPoints = -1;
        this.seasonBestResult = 100;
        this.seasonDnfs = 0;
    }

    addPole() {
        this.poles++;
        this.seasonPoles++;
    }

    addFastestLap() {
        this.fastestLaps++;
        this.seasonFastestLaps++;
    }

    addDnf() {
        this.dnfs++;
        this.seasonDnfs++;
    }

    addRaceResult(racePos, pointsSystem) {
        this.bestResult = Math.min(this.bestResult, racePos);
        this.seasonBestResult = Math.min(this.seasonBestResult, racePos);

        if (this.seasonPoints === -1) {
            this.seasonPoints = 0;
        }
        const posIdx = racePos - 1;
        if (pointsSystem.length > posIdx) {
            this.points += pointsSystem[posIdx];
            this.seasonPoints += pointsSystem[posIdx];
        }

        switch (racePos) {
            case 1:
                this.victories++;
                this.seasonVictories++;
            case 2:
            case 3:
                this.podiumns++;
                this.seasonPodiumns++;
                break;
        }
    }

    resetSeason() {
        this.seasonRaces = 0;
        this.seasonPoles = 0;
        this.seasonPodiumns = 0;
        this.seasonVictories = 0;
        this.seasonFastestLaps = 0;
        this.seasonPoints = -1;
        this.seasonBestResult = 100;
        this.seasonDnfs = 0;
    }
}


class Team extends ChampionshipEntry {
    constructor(args) {
        super(args);
        this._name = args.name ?? "Racing Team";
        this._engine = args.engine ?? 5;
        this._chassis = args.chassis ?? 5;
        this._crew = args.crew ?? 5;
        this._driver1 = null;
        this._driver2 = null;
    }

    get name() { return this._name; }
    get engine() { return this._engine; }
    get chassis() { return this._chassis; }
    get crew() { return this._crew; }
    get driver1() { return this._driver1; }
    get driver2() { return this._driver2; }
    set driver1(drv) {
        if (this._driver1 === drv) {
            return;
        }
        const oldDrv = this._driver1;
        this._driver1 = drv;
        if (oldDrv && oldDrv.team === this) {
            oldDrv.team = null;
        }
        if (drv) {
            drv.team = this;
        }
    }
    set driver2(drv) {
        if (this._driver2 === drv) {
            return;
        }
        const oldDrv = this._driver2;
        this._driver2 = drv;
        if (oldDrv && oldDrv.team === this) {
            oldDrv.team = null;
        }
        if (drv) {
            drv.team = this;
        }
    }
}


const teams = {
    rbr: new Team({ name: "Red Bull Racing", engine: 8, chassis: 6.5, crew: 7, }),
    mer: new Team({ name: "Mercedes", engine: 8, chassis: 6.5, crew: 7, }),
    fer: new Team({ name: "Ferrari", engine: 8, chassis: 7.5, crew: 7, }),
    mcl: new Team({ name: "McLaren", engine: 8, chassis: 7.5, crew: 7, }),
    amr: new Team({ name: "Aston Martin", engine: 8, chassis: 4, crew: 6, }),
    alp: new Team({ name: "Alpine", engine: 6, chassis: 5, crew: 6, }),
    wil: new Team({ name: "Williams", engine: 8, chassis: 4, crew: 6, }),
    atr: new Team({ name: "Alpha Tauri", engine: 8, chassis: 5, crew: 6, }),
    sau: new Team({ name: "Sauber", engine: 8, chassis: 3, crew: 6, }),
    haa: new Team({ name: "Haas", engine: 8, chassis: 5, crew: 6, }),
};
