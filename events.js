class RaceEvent {
    constructor(track, teams) {
        this._track = track;
        this._teams = teams;
        this._raceLaps = track.totalLaps;

        this._dnfReasons = ["Accident", "Colision damage", "Spun off",
            "Suspension", "Brakes", "Engine", "Power Unit", "Gearbox", "Clutch", "Fuel pump",
            "Oil leak", "Water leak", "Hydraulics", "Electrical", "Overheating", "Steering"
        ];
    }

    get track() { return this._track; }
    get lapsRemaining() { return this._raceLaps; }
    get finished() { return this._raceLaps <= 0; }
    get classification() { return this._drivers; }

    start() {
        this._drivers = [];

        let team, drivers, drv, teamFactor, driverFactor, driverLapTime, tyreStrategy, rnd;
        for (team of this._teams) {
            drivers = [];
            if (team.driver1) {
                drivers.push(team.driver1);
            }
            if (team.driver2) {
                drivers.push(team.driver2);
            }

            teamFactor = this._calcTeamFactor(this.track.engine, team.engine)
                        + this._calcTeamFactor(this.track.chassis, team.chassis)
                        + this._calcTeamFactor(this.track.crew, team.crew);

            for (drv of drivers) {
                driverFactor = this._calcDriverFactor(drv, this.track.driver) + teamFactor;
                driverLapTime = this.track.refereceLapTime + (this.track.refereceLapTime * driverFactor / 100);

                rnd = Math.floor(Math.random() * 10);
                if (rnd === 0) {
                    tyreStrategy = this.track.buildTyreStrategy(drv, 3);
                } else if (rnd === 1) {
                    tyreStrategy = this.track.buildTyreStrategy(drv, 2);
                } else if (rnd < 5) {
                    tyreStrategy = this.track.buildTyreStrategy(drv, 1);
                } else {
                    tyreStrategy = this.track.buildTyreStrategy(drv, 0);
                }
                
                // console.error(`${drv.name}: ${new Date(driverLapTime * 1000).toISOString().substring(14)}`);
                this._drivers.push({
                    team: team,
                    driver: drv,
                    driverLapTime: driverLapTime,
                    q1Laps: [],
                    q2Laps: [],
                    q3Laps: [],
                    laps: [],
                    totalTime: 0,
                    fastestLap: 5000,
                    tyres: [tyreStrategy.shift()],
                    tyreStrategy: tyreStrategy,
                    dnf: null,
                });
            }
        }

        this._renderWelcomeScreen();
    }

    _renderWelcomeScreen() {
        // Ensure controls are created
        this.getControl();
        
        // Previous pole-sitters
        // Previous winners
        
        const startQualyCtrl = document.createElement("button");
        startQualyCtrl.innerText = "Start Qualifying";
        startQualyCtrl.onclick = () => {
            window.clearTimeout(this.timeout);
            startQualyCtrl.remove();
            this._runQualy();
        };

        this.actionsCtrl.innerHTML = "";
        this.actionsCtrl.appendChild(startQualyCtrl);

        if (Season.autoContinue) {
            this.timeout = window.setTimeout(() => {
                startQualyCtrl.click();
            }, Season.autoContinueSpeed);
        }
    }

    _runQualy() {
        let i, phase, drivers, results, currentDrv, currentLap;

        this.resultsCtrl.innerHTML = "";
        const raceInfo = document.createElement("row");
        raceInfo.classList.add("race-event-info");
        this.resultsCtrl.appendChild(raceInfo);

        const title = document.createElement("h3");
        title.innerHTML = "Q1";
        raceInfo.appendChild(title);
        
        const q1Ctrl = document.createElement("column");
        // const q2Ctrl = document.createElement("column");
        // const q3Ctrl = document.createElement("column");
        
        // this.resultsCtrl.appendChild(q3Ctrl);
        // this.resultsCtrl.appendChild(q2Ctrl);
        this.resultsCtrl.appendChild(q1Ctrl);

        const phases = [{
            name: "Q1",
            laps: 3,
            lapsKey: "q1Laps",
            drvCount: this._drivers.length,
            ctrl: q1Ctrl,
        }, {
            name: "Q2",
            laps: 2,
            lapsKey: "q2Laps",
            drvCount: 10 + Math.floor((this._drivers.length - 10) / 2),
            ctrl: q1Ctrl,
        }, {
            name: "Q3",
            laps: 2,
            lapsKey: "q3Laps",
            drvCount: 10,
            ctrl: q1Ctrl,
        }];

        const runPhase = (idx) => {
            if (idx >= phases.length) {
                this._drivers[0].driver.addPole();
                this._drivers[0].team.addPole();
                for (i = 0; i < this._drivers.length; i++)
                    this._drivers[i].totalTime = 0.5 * i;

                const startRaceCtrl = document.createElement("button");
                startRaceCtrl.innerText = "Start Race";
                startRaceCtrl.onclick = () => {
                    window.clearTimeout(this.timeout);
                    startRaceCtrl.remove();
                    this._runRace();
                };
                this.actionsCtrl.innerHTML = "";
                this.actionsCtrl.appendChild(startRaceCtrl);

                if (Season.autoContinue) {
                    this.timeout = window.setTimeout(() => {
                        startRaceCtrl.click();
                    }, Season.autoContinueSpeed);
                }
                return;
            }

            phase = phases[idx];
            title.innerHTML = phase.name;
            phase.ctrl.classList.add("race-event-results");
            currentLap = 0;
            currentDrv = 0;

            drivers = [];
            for (i = 0; i < phase.drvCount; i++) {
                drivers.push(this._drivers[i]);
            }
            drivers.shuffle();
            
            const interval = window.setInterval(() => {
                if (currentLap >= phase.laps) {
                    window.clearInterval(interval);
                    runPhase(idx + 1);
                    return;
                }

                if (currentDrv < phase.drvCount) {
                    results = this._nextQualyLap(drivers[currentDrv], phase.lapsKey);
                    this._printQualyResults(results, phase, phases);
                    currentDrv++;
                } else {
                    currentDrv = 0;
                    currentLap++;
                }
            }, Season.simulationSpeed);
        };
        runPhase(0);
    }

    _printQualyResults(results, phase, phases) {
        let i, row, col, label, drv, lapsKey, laps, lap, bestLap, fastestLap;
        
        phase.ctrl.innerHTML = "";

        row = document.createElement("row");
        row.classList.add("race-event-results-header");
        phase.ctrl.appendChild(row);

        const columns = ["Pos", "Driver", "Best Lap", "Last Lap", "Gap"];
        for (col of columns) {
            label = document.createElement("h5");
            label.innerHTML = col;
            row.appendChild(label);
        }

        for (i = 0; i < results.length; i++) {
            drv = results[i];

            row = document.createElement("row");
            phase.ctrl.appendChild(row);

            col = document.createElement("span");
            col.innerHTML = i + 1;
            row.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.driver.name;
            row.appendChild(col);

            bestLap = 10000;
            lapsKey = drv.q3Laps.length > 0 ? "q3Laps"
                : drv.q2Laps.length > 0 ? "q2Laps"
                : "q1Laps";
            
            laps = drv[lapsKey];
            for (lap of laps) {
                bestLap = Math.min(bestLap, lap);
            }
            
            col = document.createElement("span");
            if (laps.length > 0) {
                col.innerHTML =  new Date(bestLap * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            col = document.createElement("span");
            if (laps.length > 0) {
                col.innerHTML =  new Date(laps[laps.length - 1] * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            col = document.createElement("span");
            if (fastestLap && laps.length > 0) {
                col.innerHTML = new Date((bestLap - fastestLap) * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            if (i === 0) {
                fastestLap = bestLap;
            }
        }

        for (let p of phases) {
            if (phase.ctrl.childNodes.length > p.drvCount && p.drvCount < results.length)
                phase.ctrl.childNodes[p.drvCount].classList.add(`race-event-results-separator`);
        }
    }

    _nextQualyLap(drv, lapsKey) {
        let /*i, drv,*/ lapTime, minD1, minD2;
        // for (i = 0; i < drvCount; i++) {
        //     drv = this._drivers[i];
        //     lapTime = this._calcDriverQualyLap(drv, drv.driverLapTime);
        //     drv[lapsKey].push(lapTime);
        // }
        lapTime = this._calcDriverQualyLap(drv, drv.driverLapTime);
        drv[lapsKey].push(lapTime);

        this._drivers.sort((d1, d2) => {
            if (d1.q3Laps.length > 0 && d2.q3Laps.length === 0 || d1.q3Laps.length === 0 && d2.q3Laps.length > 0) {
                return d1.q3Laps.length > 0 ? -1 : 1;
            }
            if (d1.q2Laps.length > 0 && d2.q2Laps.length === 0 || d1.q2Laps.length === 0 && d2.q2Laps.length > 0) {
                return d1.q2Laps.length > 0 ? -1 : 1;
            }
            if (d1.q1Laps.length > 0 && d2.q1Laps.length === 0 || d1.q1Laps.length === 0 && d2.q1Laps.length > 0) {
                return d1.q1Laps.length > 0 ? -1 : 1;
            }

            lapsKey = d1.q3Laps.length > 0 && d1.q3Laps.length === d2.q3Laps.length ? "q3Laps"
                    : d1.q2Laps.length > 0 && d1.q2Laps.length === d2.q2Laps.length ? "q2Laps"
                    : "q1Laps"

            minD1 = 10000;
            minD2 = 10000;
            for (lapTime of d1[lapsKey]) {
                minD1 = Math.min(minD1, lapTime);
            }
            for (lapTime of d2[lapsKey]) {
                minD2 = Math.min(minD2, lapTime);
            }

            if (minD1 === minD2) {
                return 0;
            } else if (minD1 > minD2) {
                return 1;
            }
            return -1;
        });
        return this._drivers;
    }

    _calcDriverQualyLap(drv, referenceLapTime) {
        const tyre = this.track.getSoftTyre(drv.driver);
        return tyre.calcDriverLap(referenceLapTime);
    }

    _runRace() {
        let results;

        this.resultsCtrl.innerHTML = "";

        const raceInfo = document.createElement("row");
        raceInfo.classList.add("race-event-info");
        this.resultsCtrl.appendChild(raceInfo);

        const title = document.createElement("h3");
        title.innerHTML = "Race";
        raceInfo.appendChild(title);

        const lapsCtrl = document.createElement("span");
        lapsCtrl.innerHTML = `${this.lapsRemaining} laps remaining`;
        raceInfo.appendChild(lapsCtrl);

        const resultsCtrl = document.createElement("column");
        resultsCtrl.classList.add("race-event-results");
        this.resultsCtrl.appendChild(resultsCtrl);

        const interval = window.setInterval(() => {
            if (this.finished) {
                window.clearInterval(interval);

                const finishRaceCtrl = document.createElement("button");
                finishRaceCtrl.innerText = "Finish Event";
                finishRaceCtrl.onclick = () => {
                    window.clearTimeout(this.timeout);
                    finishRaceCtrl.remove();
                    this.onRaceFinished();
                };
                this.actionsCtrl.innerHTML = "";
                this.actionsCtrl.appendChild(finishRaceCtrl);

                if (Season.autoContinue) {
                    this.timeout = window.setTimeout(() => {
                        finishRaceCtrl.click();
                    }, Season.autoContinueSpeed);
                }

                return;
            }

            results = this._nextRaceLap();
            lapsCtrl.innerHTML = `${this.lapsRemaining} laps remaining`;
            this._printRaceResults(results, resultsCtrl);
        }, Season.simulationSpeed);
    }

    _printRaceResults(results, ctrl) {
        let i, row, col, label, drv, prevDrv, firstDrv;
        
        ctrl.innerHTML = "";

        row = document.createElement("row");
        row.classList.add("race-event-results-header");
        ctrl.appendChild(row);

        const columns = ["Pos", "Driver", "Interval", "Gap", "Lap", "Lap + 1", "Lap + 2", "Tyre"];
        for (col of columns) {
            label = document.createElement("h5");
            label.innerHTML = col;
            row.appendChild(label);
        }

        for (i = 0; i < results.length; i++) {
            drv = results[i];

            row = document.createElement("row");
            ctrl.appendChild(row);

            col = document.createElement("span");
            col.innerHTML = i + 1;
            row.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = drv.driver.name;
            row.appendChild(col);

            col = document.createElement("span");
            if (drv.dnf) {
                col.innerHTML = drv.dnf;
            } else if (prevDrv) {
                col.innerHTML = new Date((drv.totalTime - prevDrv.totalTime) * 1000).toISOString().substring(14);
            }
            row.appendChild(col);
            
            col = document.createElement("span");
            if (firstDrv && !drv.dnf) {
                col.innerHTML = new Date((drv.totalTime - firstDrv.totalTime) * 1000).toISOString().substring(14);
            }
            row.appendChild(col);
            
            col = document.createElement("span");
            if (!drv.dnf) {
                col.innerHTML =  new Date(drv.laps[drv.laps.length - 1] * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            col = document.createElement("span");
            if (drv.laps.length > 1) {
                col.innerHTML =  new Date(drv.laps[drv.laps.length - 2] * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            col = document.createElement("span");
            if (drv.laps.length > 2) {
                col.innerHTML =  new Date(drv.laps[drv.laps.length - 3] * 1000).toISOString().substring(14);
            }
            row.appendChild(col);

            col = document.createElement("span");
            col.innerHTML = "";
            drv.tyres.forEach((t) => col.innerHTML += t.tyre.name);
            row.appendChild(col);

            prevDrv = drv;
            if (i === 0) {
                firstDrv = drv;
            }
        }
    }

    _calcDriverLap(drv, referenceLapTime) {
        const tyreData = drv.tyres[drv.tyres.length - 1];
        let lapTime = tyreData.tyre.calcDriverLap(referenceLapTime);
        tyreData.lapCount--;
        if (tyreData.lapCount <= 0 && drv.tyreStrategy.length > 0) {
            lapTime += this.track.pitTime;
            drv.tyres.push(drv.tyreStrategy.shift());
        }
        drv.fastestLap = Math.min(drv.fastestLap, lapTime);
        return lapTime;
    }

    _calcDriverFactor(drv, trackValue) {
        const consistencyDelta = 10 - drv.raceConsistency;
        const driverSkill = Math.max(1, Math.min(8, drv.currentSkill) - (Math.random() * consistencyDelta));
        // console.error(`${drv.name}: ${driverSkill}`);
        return (100 - (driverSkill * 10)) * (trackValue / 5) / 100;
    }

    _calcTeamFactor(trackValue, teamValue) {
        return (100 - (teamValue * 10)) * (trackValue / 5) / 100;
    }

    _nextRaceLap() {
        let drv, lapTime;
        this._raceLaps--;

        if (Season.dnfs) {
            const dnfProb = Math.floor(Math.random() * 25);
            if (dnfProb === 0) {
                do {
                    const drvIdx = Math.floor(Math.random() * this._drivers.length);
                    drv = this._drivers[drvIdx];
                } while(drv.dnf);
                const reasonIdx = Math.floor(Math.random() * this._drivers.length);
                drv.dnf = this._dnfReasons[reasonIdx];
                drv.driver.addDnf();
                drv.team.addDnf();
            }
        }

        for (drv of this._drivers) {
            if (drv.dnf) {
                continue;
            }
            lapTime = this._calcDriverLap(drv, drv.driverLapTime);
            drv.laps.push(lapTime);
            drv.totalTime += lapTime;
        }

        this._drivers.sort((d1, d2) => {
            if (d1.dnf && !d2.dnf) {
                return 1;
            }
            if (!d1.dnf && d2.dnf) {
                return -1;
            }
            if (d1.dnf && d2.dnf) {
                return d1.totalTime > d2.totalTime ? -1 : 1;
            }
            if (d1.totalTime === d2.totalTime) {
                return 0;
            } else if (d1.totalTime > d2.totalTime) {
                return 1;
            }
            return -1;
        });
        return this._drivers;
    }

    getControl() {
        if (!this.ctrl) {
            const titleCtrl = document.createElement("h2");
            titleCtrl.innerText = this.track.name;

            const attrs = document.createElement("column");
            const headerCtrl = document.createElement("row");
            headerCtrl.classList.add("race-event-header");
            headerCtrl.append(titleCtrl);
            headerCtrl.append(attrs);
            
            const vals = [
                { label: "Length", value: `${this.track.totalLaps} laps` },
                { label: "Average pit time loss", value: `${this.track.pitTime} secs` },
            ];
            for (let val of vals) {
                let labelCtrl = document.createElement("label");
                labelCtrl.innerText = `${val.label}:`;
                let valCtrl = document.createElement("span");
                valCtrl.innerText = val.value;
                let rowCtrl = document.createElement("row");
                rowCtrl.appendChild(labelCtrl);
                rowCtrl.appendChild(valCtrl);
                attrs.appendChild(rowCtrl);
            }

            this.resultsCtrl = document.createElement("column");
            this.resultsCtrl.classList.add("race-event-form");
            this.actionsCtrl = document.createElement("row");
            this.actionsCtrl.classList.add("race-event-actions");

            this.ctrl = document.createElement("column");
            this.ctrl.classList.add("race-event");
            this.ctrl.appendChild(headerCtrl);
            this.ctrl.appendChild(this.resultsCtrl);
            this.ctrl.appendChild(this.actionsCtrl);
        }
        return this.ctrl;
    }
}