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
        this._colors = args.colors ?? new TeamColors({});
        this._driver1 = null;
        this._driver2 = null;
    }

    get name() { return this._name; }
    get color() { return this._colors.body; }
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

    getCar(tyre) {
        // const img = document.createElement("img");
        // img.classList.add("race-event-animation-car");
        // img.src = "car.svg";
        // return img;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add("race-event-animation-car");
        svg.setAttribute("viewBox", "0 0 400 120");
        // svg.innerHTML = `
        //     <path d="M81.67 75.39v-2.32s-2.86-.19-4.09-.66c-.66-.25-1.47-1.62-1.27-2.9.19-1.27 1.04-1.93 2.55-1.89 1.54.04 3.36.17 5.02.46 2.82.5 4.47 1.21 4.9 1.39.66.27 1.12 2.66-.08 3.24-.7.34-2.51.42-2.51.42l.04 2.32z" fill="${this._colors[1]}"/>
        //     <path d="M5.31 114.43s-.75-3.51 1.71-5.78c2.85-2.63 6.2-3.65 10.08-5.16 3.39-1.32 8.51-2.87 8.51-2.87l10.46-6.69s4.67-1.11 12.96-.95c7.19.14 19.09 1.17 19.09 1.17s2.53-2.69 6.36-3.15 5.53-.11 5.53-.11l.35-16.25s6.49 0 8.57.2c3.13.31 7.03 3.55 8.13 4.67.29.3 6.15 6.61 6.15 6.61l3.71 1.74s5.21-20.47 5.95-20.71c.01 0 3.43-.28 6.51-.38 4.06-.13 6.92 0 7.26.2.25.15-2.69 14.11-2.69 14.11l-27.7 36.24s-39.32-1.04-39.56-1.39c-.23-.35-11.37-5.68-11.37-5.68s-27.38 3.13-27.84 3.36c-.46.24-12.17.82-12.17.82" fill="${this._colors[0]}"/>
        //     <path d="m104.62 101.37 16.61-3.4 2.76-16.92s-7.43-.07-13.36 6.84c-5.66 6.61-6.01 13.48-6.01 13.48m-50.08-9.38c-.02 1.53 2.9 3.65 5.97 3.74 3.52.1 4.56-.57 4.6-1.8s-.04-3.77-.04-3.77l-8.4-1.75c-.01 0-2.1 1.42-2.13 3.58" fill="${this._colors[1]}"/>
        //     <path d="M56.43 88.61s1.98-1.85 4.36-2.34c2.15-.44 4.24-.36 4.24.34 0 1.19.04 3.54.04 3.54s-1.32 1.18-4.89.84c-2.26-.21-3.44-1.9-3.75-2.38" fill="${this._colors[0]}"/>
        //     <path d="M50.2 110.46s6.52.58 11.47-1.44c4.06-1.66 5.71-3.91 8.32-5.26 1.31-.68 3.96-.58 3.96-.58l1.17 11.79-22.36 1.57-2.34-3.51z" fill="#00000055"/>
        //     <path d="m112.87 67.16-3.67 22.61-14.52-3.39s1.49-1.76 1.98-3.3c.52-1.65.41-3.57.41-3.57l7.99 6.4s2.64-14.77 2.88-15.67.98-1.86 2.36-2.6c.86-.45 2.57-.48 2.57-.48m-.17 30.7 8.52.12s-.43 6.72-1.06 8.47c-1.09 3.02-3.4 2.78-3.4 2.78s-4.1-11.47-4.06-11.37M2.15 113.29c-.31.2-.44 6.98-.22 7.13s7.97.15 7.97.15.2-7.28-.76-7.28-6.77-.15-6.99 0" fill="#636866"/>
        //     <path d="M18 113.44s.29 7.54-.18 7.76c-.48.22-8.45.22-8.75.04-.29-.18-.07-7.87-.04-7.98.03-.12 9.15-.08 8.97.18" fill="${this._colors[1]}"/>
        //     <path d="M46.42 114.17h4.16s-2.68 4.26-2.96 4.68-.18 1.16 1.2 1.2c1.37.04 44.47 0 44.47 0l-4.72-6.22H51.42s-.24-2.08-.93-3.77-2.27-2.95-2.27-2.95z" fill="#636866"/>
        //     <path d="M71.99 102.83c-.14.19-.27 10.76-.06 10.97s4.96.18 5.11.06.18-10.7.09-10.88-4.99-.36-5.14-.15" fill="#000"/>
        //     <path d="M48.32 108.34c0 8.57-6.99 15.52-15.6 15.52s-15.57-5.76-15.6-15.52c-.03-8.57 6.63-15.46 15.6-15.52 8.93-.06 15.6 6.95 15.6 15.52" fill="#4c4038"/>
        //     <path d="M32.72 95.23c-7.33 0-13.28 5.89-13.28 13.15s5.95 13.15 13.28 13.15S46 115.64 46 108.38s-5.94-13.15-13.28-13.15m-.09 24.41c-6.14 0-11.12-5.03-11.12-11.23s4.98-11.23 11.12-11.23 11.12 5.03 11.12 11.23c0 6.21-4.98 11.23-11.12 11.23" fill="${tyre.color}"/>
        //     <path d="M32.54 100.08c-4.56 0-8.26 3.62-8.26 8.09s3.7 8.09 8.26 8.09 8.26-3.62 8.26-8.09-3.7-8.09-8.26-8.09m-.03 12.65c-2.57 0-4.66-2.05-4.66-4.57s2.09-4.57 4.66-4.57 4.66 2.05 4.66 4.57-2.09 4.57-4.66 4.57" fill="#858583"/>
        //     <path d="M117.8 108.38c0 8.57-6.99 15.52-15.6 15.52s-15.57-5.76-15.6-15.52c-.03-8.57 6.63-15.46 15.6-15.52 8.92-.06 15.6 6.95 15.6 15.52" fill="#4c4038"/>
        //     <path d="M102.2 95.27c-7.33 0-13.28 5.89-13.28 13.15s5.95 13.15 13.28 13.15 13.28-5.89 13.28-13.15-5.95-13.15-13.28-13.15m-.09 24.41c-6.14 0-11.12-5.03-11.12-11.23s4.98-11.23 11.12-11.23 11.12 5.03 11.12 11.23c-.01 6.21-4.98 11.23-11.12 11.23" fill="${tyre.color}"/>
        //     <path d="M102.02 100.12c-4.56 0-8.26 3.62-8.26 8.09s3.7 8.09 8.26 8.09 8.26-3.62 8.26-8.09-3.7-8.09-8.26-8.09m-.03 12.65c-2.57 0-4.66-2.05-4.66-4.57s2.09-4.57 4.66-4.57 4.66 2.05 4.66 4.57-2.09 4.57-4.66 4.57" fill="#858583"/>
        // `;
        svg.innerHTML = `
            <g transform="translate(0.000000,90.000000) scale(0.050000,-0.050000)">
            <path name="body" fill="${this._colors.body}" d="M3310 1655 c-5 -14 -11 -74 -14 -135 l-6 -110 -250 -10 c-232 -9 -256 -14 -330 -65 l-79 -55 -510 0 -509 0 90 -57 c231 -147 348 -421 279 -658 l-18 -65 218 0 219 0 0 108 c0 107 -1 109 -89 161 -255 149 -249 376 11 413 430 61 1323 -5 1967 -145 l278 -61 36 47 c50 65 49 70 -58 137 -356 227 -1209 569 -1235 495z"/>
            <path name="back_wing1" fill="${this._colors.backWing}" d="M5113 1647 c-7 -8 -13 -89 -13 -180 l0 -167 66 0 c109 0 246 -58 345 -145 l94 -82 86 98 87 99 1 195 1 195 -327 0 c-179 0 -332 -6 -340 -13z"/>
            <path name="back_wing2" fill="${this._colors.backWing}" d="M5840 1473 l0 -191 -102 -122 c-81 -98 -99 -133 -89 -171 17 -72 31 -62 140 96 l100 145 8 191 c6 157 2 195 -25 217 -29 24 -32 9 -32 -165z"/>
            <path name="back_wing3" fill="${this._colors.backWing}" d="M4784 1556 c-15 -15 -24 -87 -24 -189 l0 -165 105 49 c58 27 125 49 150 49 42 0 45 8 45 140 l0 140 -126 0 c-71 0 -136 -10 -150 -24z"/>
            <path name="front_tyre" fill="black" d="M1240 1241 c-384 -116 -522 -604 -254 -896 403 -439 1113 -41 944 528 -82 276 -413 453 -690 368z m302 -132 c298 -105 377 -493 145 -713 -269 -255 -707 -60 -707 314 0 298 282 498 562 399z"/>
            <path name="front_tyre_mark" fill="${tyre.color}" d="M1260 1048 c-370 -160 -262 -708 140 -708 328 0 495 412 257 634 -108 100 -267 130 -397 74z m300 -86 c195 -139 184 -412 -21 -517 -320 -164 -598 244 -334 491 95 89 252 100 355 26z"/>
            <path name="front_wheel" fill="${this._colors.wheel}" d="M1287 939 c-242 -120 -156 -499 113 -499 273 0 356 381 109 500 -102 50 -119 50 -222 -1z"/>
            <path name="back_tyre" fill="black" d="M4890 1214 c-549 -262 -370 -1055 238 -1054 556 1 743 749 257 1034 -133 78 -355 87 -495 20z m411 -129 c322 -163 315 -620 -11 -768 -182 -82 -424 -11 -530 156 -236 373 151 810 541 612z"/>
            <path name="back_tyre_mark" fill="${tyre.color}" d="M4970 1052 c-141 -61 -245 -249 -221 -399 67 -427 696 -405 727 26 20 281 -253 483 -506 373z m270 -77 c278 -142 207 -536 -103 -568 -344 -36 -449 468 -122 584 103 37 123 36 225 -16z"/>
            <path name="back_wheel" fill="${this._colors.wheel}" d="M5051 966 c-188 -49 -260 -301 -125 -436 129 -129 303 -108 410 50 123 181 -70 441 -285 386z"/>
            <path name="side_pod" fill="${this._colors.sidePod}" d="M2280 1126 c-167 -61 -148 -181 51 -318 88 -60 109 -85 109 -131 0 -175 1042 -256 1762 -137 334 54 309 37 324 232 l12 162 -190 43 c-574 132 -1861 225 -2068 149z"/>
            <path name="nose" fill="${this._colors.nose}" d="M660 958 c-370 -160 -428 -192 -465 -255 -50 -84 -44 -94 24 -36 93 77 185 98 392 89 l186 -8 13 70 c7 39 31 105 53 148 54 105 57 105 -203 -8z"/>
            <path name="front_wing1" fill="${this._colors.frontWing}" d="M443 698 c-105 -20 -232 -92 -312 -176 l-58 -62 386 0 386 0 -13 45 c-6 25 -18 78 -24 118 -17 99 -128 122 -365 75z"/>
            <path name="front_wing2" fill="${this._colors.frontWing}" d="M80 393 c0 -47 48 -53 443 -53 351 0 379 3 373 35 -9 48 -816 65 -816 18z"/>
            <path name="floor" fill="black" d="M2440 460 l0 -100 1089 0 1088 0 -43 100 c-27 61 -54 96 -70 90 -387 -140 -1362 -155 -1867 -28 -204 51 -197 53 -197 -62z"/>
            </g>
        `;
        return svg;
    }
}

class TeamColors {
    constructor(args) {
        this._body = args.body ?? "red";
        this._sidePod = args.sidePod ?? this._body;
        this._nose = args.nose ?? this._body;
        this._frontWing = args.frontWing ?? "black";
        this._backWing = args.backWing ?? "black";
        this._wheel = args.wheel ?? "black";
    }

    get body() { return this._body; }
    get sidePod() { return this._sidePod; }
    get nose() { return this._nose; }
    get frontWing() { return this._frontWing; }
    get backWing() { return this._backWing; }
    get wheel() { return this._wheel; }
}


const teams = {
    rbr: new Team({ name: "Red Bull Racing", engine: 8, chassis: 6.5, crew: 7, colors: new TeamColors({ body: "#121F45", sidePod: "#121F45", nose: "#FFC906", }), }),
    mer: new Team({ name: "Mercedes", engine: 8, chassis: 6.5, crew: 7, colors: new TeamColors({ body: "#C6C6C6", /*sidePod: "#131313",*/ frontWing: "#00A19C", backWing: "#00A19C" }), }),
    fer: new Team({ name: "Ferrari", engine: 8, chassis: 7.5, crew: 7, colors: new TeamColors({ body: "#BD0000", }), }),
    mcl: new Team({ name: "McLaren", engine: 8, chassis: 7.5, crew: 7, colors: new TeamColors({ body: "#FF8000", sidePod: "#000000", frontWing: "#FF8000", backWing: "#47C7FC" }), }),
    amr: new Team({ name: "Aston Martin", engine: 8, chassis: 4, crew: 6, colors: new TeamColors({ body: "#00594F", }), }),
    alp: new Team({ name: "Alpine", engine: 6, chassis: 5, crew: 6, colors: new TeamColors({ body: "#0078C1", sidePod: "#FD4BC7", }), }),
    wil: new Team({ name: "Williams", engine: 8, chassis: 4, crew: 6, colors: new TeamColors({ body: "#0b0a33", sidePod: "#1C1996", }), }),
    atr: new Team({ name: "Alpha Tauri", engine: 8, chassis: 5, crew: 6, colors: new TeamColors({ body: "#2945ac", sidePod: "#e1e0e7", frontWing: "#e1e0e7", backWing: "#e1e0e7", }), }),
    sau: new Team({ name: "Sauber", engine: 8, chassis: 3, crew: 6, colors: new TeamColors({ body: "#48b13a", sidePod: "#000000", backWing: "#48b13a" }),}),
    haa: new Team({ name: "Haas", engine: 8, chassis: 5, crew: 6, colors: new TeamColors({ body: "#F9F2F2", sidePod: "#000000", frontWing: "#F62039", backWing: "#F62039", }), }),
};
