class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.row = null;
        this.col = null;
        this.orientation = null;
    }

    setPosition(row, col, orientation) {
        this.row = row;
        this.col = col;;
        this.orientation = orientation;
    }

    hit() {
        this.timesHit++;
    }

    isSunk() {
        return (this.length - this.timesHit) <= 0;
    }
}

export { Ship };