import { Gameboard } from "./gameboard.js";

class Player {
    constructor(team) {
        this.team = team;
        this.gameboard = new Gameboard();
    }
}

export { Player };