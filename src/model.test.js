import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';

test('ship', () => {
    const myShip = new Ship(5, 0);
    expect(myShip.isSunk()).toBe(false);

    myShip.hit();
    myShip.hit();

    expect(myShip.isSunk()).toBe(false);

    myShip.hit();
    myShip.hit();
    myShip.hit();

    expect(myShip.isSunk()).toBe(true);
});

test('gameboard', () => {
    const gb = new Gameboard();
    expect(gb.allShipsSunk()).toBeFalsy();

    const ship1 = gb.ships[0];
    const ship2 = gb.ships[1];
    gb.placeShip(ship1, 0, 0, 'h');
    gb.placeShip(ship2, 2, 2, 'v');

    // test sinking a ship and missing a space
    gb.receiveAttack(4, 2);
    gb.receiveAttack(3, 2);
    expect(ship2.isSunk()).toBeFalsy();
    
    gb.receiveAttack(3, 3);
    gb.receiveAttack(2, 2);
    gb.receiveAttack(5, 2)
    expect(ship2.isSunk()).toBeTruthy();

    // test sinking all ships
    gb.receiveAttack(0, 0);
    gb.receiveAttack(0, 1);

    expect(ship1.isSunk()).toBeFalsy();
    gb.receiveAttack(0, 2);
    gb.receiveAttack(0, 3);
    
    expect(ship1.isSunk()).toBeFalsy();
    gb.receiveAttack(0, 4);
    expect(ship1.isSunk()).toBeTruthy();
    // expect(gb.allShipsSunk()).toBeTruthy(); THIS DOESN'T WORK YET BC NOT ALL SHIPS ARE PLACED ON BOARD
})

test('gameboard.shipAt()', () => {
    const player1 = new Player();
    console.log(player1.gameboard.shipAt(0,0));
})