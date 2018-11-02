import { EntityMap } from 'colyseus';
import { Player } from '../../models/player';
import { Map } from '../../models/map';
import { Position } from '../../models/position';
import { Team } from '../../models/team';
import { Base } from '../../models/base';

export class State {
    players: EntityMap<Player> = {};
    map: Map = new Map(50, 100, new Position(50, 50));
    teamRed: Team = new Team("Red", new Base(100, new Position(75, 75)));
    teamBlue: Team = new Team("Blue", new Base(100, new Position(75, 125)));


    constructor () {
        console.log(this.map);
        console.log(this.teamRed);
        console.log(this.teamBlue);
    };

    addPlayer (client) {
        var countTeamRed: Number;
        var countTeamBlue: Number;

        console.log(this.players);

        //this.players[client.id] = new Player(client.id, 100, 1, );
        console.log('added player');
    };


    removePlayer (client) {
        delete this.players[client.id]
        console.log('removed player');
    };

    calculateState () {

    };
};
