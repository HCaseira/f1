class Tyre {
    constructor(args) {
        this._name = args.name ?? "?";
        this._driver = args.driver;
        this._performance = args.performance ?? 1;
        this._tyreLife = Math.max(5, args.tyreLife ?? 20) + this._driver.tyreManagement * 0.3;
        this._tyreLife += this._tyreLife * this._driver.tyreManagement * 0.3 / 10;
        this._laps = 0;
        this._color = args.color ?? "";
    }

    get name() { return this._name; }
    get life() { return this._tyreLife; }
    get laps() { return this._laps; }
    get color() { return this._color; }

    calcDriverLap(referenceLapTime) {
        const consistencyDelta = 10 - this._driver.lapConsistency / 1.3; // otherwise a driver with 'lapConsistency' of 10 would always produce the same lap time
        const multiplier = Math.random() * consistencyDelta / 10;
        const lapTime = referenceLapTime + multiplier;

        const tyrePerformance = this._performance + Math.exp(4/this._tyreLife * this._laps) / 20;
        this._laps++;
        return lapTime + tyrePerformance;
    }
}



class Track {
    constructor(args) {
        this._name = args.name ?? "The Street";
        this._totalLaps = args.laps ?? 60;
        this._refereceLapTime = args.refereceLapTime ?? 90;
        this._pitTime = args.pitTime ?? 20;
        this._engine = Math.min(args.engine ?? 5, 10);
        this._chassis = Math.min(args.chassis ?? 5, 10);
        this._crew = Math.min(args.crew ?? 5, 10);
        this._driver = Math.min(args.driver ?? 5, 10);
        this._softTyreLife = args.softTyreLife ?? Math.ceil(this._totalLaps / 7);
        this._mediumTyreLife = args.mediumTyreLife ?? Math.ceil(this._totalLaps / 3);
        this._hardTyreLife = args.hardTyreLife ?? Math.ceil(this._totalLaps / 2);
        this._minOvertakeDelta = args.minOvertakeDelta ?? 150;
        this._rainProbability = Math.min(args.rainProbability ?? 5, 10);
        this._safetycarProbability = Math.min(args.safetycarProbability ?? 5, 10);
    }

    get name() { return this._name; }
    get totalLaps() { return this._totalLaps; }
    get refereceLapTime() { return this._refereceLapTime; }
    get engine() { return this._engine; }
    get chassis() { return this._chassis; }
    get crew() { return this._crew; }
    get driver() { return this._driver; }
    get minOvertakeDelta() { return this._minOvertakeDelta; }
    get rainProbability() { return this._rainProbability; }
    get safetycarProbability() { return this._safetycarProbability; }
    get pitTime() { return this._pitTime; }

    getSoftTyre(driver) {
        return new Tyre({ name: "S", tyreLife: this._softTyreLife, performance: 0, driver: driver, color: "#d00" });
    }

    getMediumTyre(driver) {
        return new Tyre({ name: "M", tyreLife: this._mediumTyreLife, performance: 0.8, driver: driver, color: "#D4AF37" });
    }

    getHardTyre(driver) {
        return new Tyre({ name: "H", tyreLife: this._hardTyreLife, performance: 1.5, driver: driver, color: "#ddd" });
    }

    buildTyreStrategy(driver, strategyIndex = 0) {
        let tyre;
        const tyres = {
            "s": {
                func: this.getSoftTyre,
                laps: this._softTyreLife,
            }, "m": {
                func: this.getMediumTyre,
                laps: this._mediumTyreLife,
            }, "h": {
                func: this.getHardTyre,
                laps: this._hardTyreLife,
            }
        };

        const strategy = [];
        const baseStrategies = [["m", "h"], ["h", "m"], ["s", "h"], ["s", "m"]];
        strategyIndex = Math.min(baseStrategies.length - 1, strategyIndex);
        const baseStrategy = baseStrategies[strategyIndex];
        
        let remainingLaps = this._totalLaps;
        baseStrategy.forEach((key) => {
            tyre = {
                tyre: tyres[key].func.call(this, driver),
                lapCount: tyres[key].laps + Math.floor(2 - Math.random() * 4),
            };
            strategy.push(tyre);
            remainingLaps -= tyre.lapCount;
        });
        
        while (remainingLaps > 3) {
            let k;
            let isFinal = false;
            for (k in tyres) {
                if (remainingLaps - tyres[k].laps <= 0) {
                    isFinal = true;
                    break;
                }
            }

            tyre = {
                tyre: tyres[k].func.call(this, driver),
                lapCount: tyres[k].laps + Math.floor(2 - Math.random() * 4),
            };
            strategy.push(tyre);
            remainingLaps -= tyre.lapCount;
            if (isFinal) {
                break;
            }
        }

        return strategy;
    }
}



const tracks = [
    new Track({
        name: "Bahrain Grand Prix", laps: 57, refereceLapTime: 92,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Saudi Arabian Grand Prix", laps: 50, refereceLapTime: 91,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Australian Grand Prix", laps: 58, refereceLapTime: 79,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Japanese Grand Prix", laps: 53, refereceLapTime: 93,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Chinese Grand Prix", laps: 56, refereceLapTime: 97,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Miami Grand Prix", laps: 57, refereceLapTime: 90,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Emilia Romagna Grand Prix", laps: 63, refereceLapTime: 78,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Monaco Grand Prix", laps: 78, refereceLapTime: 74,
        engine: 3, chassis: 10, crew: 6, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Canadian Grand Prix", laps: 70, refereceLapTime: 74,
        engine: 8, chassis: 6, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Spanish Grand Prix", laps: 66, refereceLapTime: 77,
        engine: 6, chassis: 9, crew: 8, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Austrian Grand Prix", laps: 71, refereceLapTime: 67,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "British Grand Prix", laps: 52, refereceLapTime: 88,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Hungarian Grand Prix", laps: 70, refereceLapTime: 80,
        engine: 3, chassis: 10, crew: 7, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Belgian Grand Prix", laps: 44, refereceLapTime: 104,
        engine: 8, chassis: 8, crew: 7, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Dutch Grand Prix", laps: 72, refereceLapTime: 73,
        engine: 8, chassis: 5, crew: 7, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Italian Grand Prix", laps: 53, refereceLapTime: 81,
        engine: 10, chassis: 6, crew: 6, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Azerbaijan Grand Prix", laps: 51, refereceLapTime: 105,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Singapore Grand Prix", laps: 62, refereceLapTime: 94,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "United States Grand Prix", laps: 56, refereceLapTime: 97,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Mexican Grand Prix", laps: 71, refereceLapTime: 78,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Brazilian Grand Prix", laps: 71, refereceLapTime: 80,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Las Vegas Grand Prix", laps: 50, refereceLapTime: 94,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Qatar Grand Prix", laps: 57, refereceLapTime: 82,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    }),
    new Track({
        name: "Abu Dhabi Grand Prix", laps: 58, refereceLapTime: 85,
        engine: 5, chassis: 5, crew: 5, 
        minOvertakeDelta: 150, rainProbability: 5, safetycarProbability: 5,
    })
];