class Season {
    constructor(args) {
        this.tracks = [...tracks];
        this.pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    }

    start1986() {
        
    }

    start2012() {

    }

    start2024() {
        teams.rbr.driver1 = drivers.ver;
        teams.rbr.driver2 = drivers.per;
        teams.mer.driver1 = drivers.ham;
        teams.mer.driver2 = drivers.rus;
        teams.fer.driver1 = drivers.lec;
        teams.fer.driver2 = drivers.sai;
        teams.mcl.driver1 = drivers.nor;
        teams.mcl.driver2 = drivers.pia;
        teams.amr.driver1 = drivers.alo;
        teams.amr.driver2 = drivers.str;
        teams.alp.driver1 = drivers.gas;
        teams.alp.driver2 = drivers.oco;
        teams.wil.driver1 = drivers.alb;
        teams.wil.driver2 = drivers.sar;
        teams.atr.driver1 = drivers.tsu;
        teams.atr.driver2 = drivers.ric;
        teams.sau.driver1 = drivers.bot;
        teams.sau.driver2 = drivers.zho;
        teams.haa.driver1 = drivers.hul;
        teams.haa.driver2 = drivers.mag;

        // const mar = new Team({ name: "Marlboro", engine: 9, chassis: 9, crew: 7, });
        // mar.driver1 = drivers.sen;
        // mar.driver2 = drivers.pro;

        this.drivers = [];
        for (let key in drivers) {
            let drv = drivers[key];
            drv.resetSeason();
            this.drivers.push(drv);
        }

        this.teams = [teams.rbr, teams.mer, teams.fer, teams.mcl, teams.amr, teams.alp, teams.wil, teams.atr, teams.sau, teams.haa];
        this.teams.forEach(t => {
            t.resetSeason();
            t.driver1.points = 0;
            t.driver2.points = 0;
        });
    }

    startNextRace() {
        window.clearTimeout(this.timeout);
        if (this.currentRace) {
            return;
        }

        document.getElementById("nextRace").classList.add("hidden");
        if (this.tracks.length === 0) {
            document.getElementById("startSeason").classList.remove("hidden");
            return;
        }

        this.currentRace = new RaceEvent(this.tracks.shift(), this.teams);
        this.currentRace.start(this.teams);
        this.currentRace.onRaceFinished = this._onRaceFinished.bind(this);

        const ctrl = document.getElementById("screen");
        ctrl.innerHTML = "";
        ctrl.appendChild(this.currentRace.getControl());
    }

    _onRaceFinished() {
        let i, drv, fastestDriver;

        const results = this.currentRace.classification;
        for (i = 0; i < results.length; i++) {
            drv = results[i];
            drv.driver.addRaceResult(i+1, this.pointsSystem);
            drv.team.addRaceResult(i+1, this.pointsSystem);
            if (!fastestDriver || drv.fastestLap < fastestDriver.fastestLap) {
                fastestDriver = drv;
            }
        }
        fastestDriver.driver.addFastestLap();
        fastestDriver.team.addFastestLap();

        this.currentRace = null;
        document.getElementById("nextRace").classList.remove("hidden");
        this.printSeasonResults();

        if (Season.autoContinue) {
            this.timeout = window.setTimeout(this.startNextRace.bind(this), Season.autoContinueSpeed);
        }
    }

    printSeasonResults() {
        let i, col, label, drv;

        const screen = document.getElementById("screen");
        screen.innerHTML = "";

        const titleCtrl = document.createElement("h2");
        titleCtrl.innerText = "Season Results";
        screen.appendChild(titleCtrl);

        const grid = document.createElement("grid");
        grid.classList.add("season-points");
        screen.appendChild(grid);
        
        const columns = ["Pos", "Driver", "Points", "Victories", "Podiums", "Fastest Laps", "Poles", "DNFs"];
        for (col of columns) {
            label = document.createElement("label");
            label.innerHTML = col;
            grid.appendChild(label);
        }

        this.drivers.sort((d1, d2) => {
            if (d1.seasonPoints < d2.seasonPoints) {
                return 1;
            } else if (d1.seasonPoints > d2.seasonPoints) {
                return -1;
            }

            if (d1.seasonBestResult < d2.seasonBestResult) {
                return -1;
            } else if (d1.seasonBestResult > d2.seasonBestResult) {
                return 1;
            }

            if (d1.seasonVictories > d2.seasonVictories) {
                return -1;
            } else if (d1.seasonVictories < d2.seasonVictories) {
                return 1;
            }

            return 0;
        });

        for (i = 0; i < this.drivers.length; i++) {
            drv = this.drivers[i];
            if (drv.seasonPoints < 0) {
                continue;
            }

            col = document.createElement("span");
            col.innerHTML = i + 1;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.name;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonPoints;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonVictories;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonPodiumns;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonFastestLaps;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonPoles;
            grid.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.seasonDnfs;
            grid.appendChild(col);
        }
    }
}



Season.simulationSpeed = 1000;
const setSimulationSpeed = (input) => {
    Season.simulationSpeed = parseInt(input.value);
    localStorage.setItem("input_simulationSpeed", Season.simulationSpeed);
};

Season.autoContinueSpeed = 3000;
Season.autoContinue = false;
const setAutoContinue = (input) => {
    Season.autoContinue = input.checked;
    localStorage.setItem("input_autoContinue", Season.autoContinue);
};

Season.dnfs = false;
const setDnfs = (input) => {
    Season.dnfs = input.checked;
    localStorage.setItem("input_dnfs", Season.dnfs);
};

Season.showAnimation = false;
const setAnimation = (input) => {
    Season.showAnimation = input.checked;
    localStorage.setItem("input_animation", Season.showAnimation);
};

const startSeason = () => {
    window.season = new Season();
    window.season.start2024();

    document.getElementById("startSeason").classList.add("hidden");
    document.getElementById("nextRace").classList.remove("hidden");
};
const nextRace = () => {
    window.season.startNextRace();
};

Array.prototype.shuffle = function() {
    let currentIndex = this.length;
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
      }
};

const parseBool = (val) => {
    if (!val) {
        return false;
    }
    switch (`${val}`.toLowerCase()) {
        case "1":
        case "on":
        case "yes":
        case "true":
            return true;
        default:
            return false;
    }
}

window.onload = () => {
    Season.simulationSpeed = parseInt(localStorage.getItem("input_simulationSpeed") ?? Season.simulationSpeed);
    Season.autoContinue = parseBool(localStorage.getItem("input_autoContinue") ?? Season.autoContinue);
    Season.dnfs = parseBool(localStorage.getItem("input_dnfs") ?? Season.dnfs);
    Season.showAnimation = parseBool(localStorage.getItem("input_animation") ?? Season.showAnimation);
    document.getElementById("input_simulationSpeed").value = Season.simulationSpeed;
    document.getElementById("input_autoContinue").checked = Season.autoContinue
    document.getElementById("input_dnfs").checked = Season.dnfs;
    document.getElementById("input_animation").checked = Season.showAnimation;

    const wrap = document.createElement("wrap");
    document.getElementById("screen").appendChild(wrap);

    const tyre = new Tyre({ name: "S", tyreLife: 10, performance: 0, driver: drivers.ver, color: "#d00" });
    for (let key in teams) {
        let car = teams[key].getCar(tyre);
        wrap.appendChild(car);
    }
};