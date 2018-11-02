import { EntityMap } from 'colyseus';
import { Player } from '../../models/player';
import { Map } from '../../models/map';
import { Position } from '../../models/position';

export class State {
    players: EntityMap<Player> = {};
    map: Map = new Map(50, 100, new Position(50, 50))
    constructor () {
        //Do here some init stuff;
        var player1 = Player.generate();
        this.players[player1.id] = player1;
        var player2 = Player.generate();
        this.players[player2.id] = player2;
        var player3 = Player.generate();
        this.players[player3.id] = player3;
        console.log(this.players);
        console.log(this.map);
    };

    addPlayer (client) {
        this.players[client.id] = new Player(client.id, 100, 6);
        console.log('added player');
    };


    removePlayer (client) {
        delete this.players[client.id]
        console.log('removed player');
    };

    calculateState () {

    };
};
