import Decimal from 'decimal';
import { EntityMap } from 'colyseus';
import { Player } from '../../models/player';
import { Map } from '../../models/map';
import { Position } from '../../models/position';
import { PlayerInput } from '../../models/playerInput';
import { Team } from '../../models/team';
import { Base } from '../../models/base';

export class State {
    players: EntityMap<Player> = {};
    teams: EntityMap<Team> = {};
    map: Map = new Map(50, 100, new Position(50, 50));

    constructor () {
        console.log(this.map);
        this.addTeam(new Team("Red", new Base(100, new Position(15, 50))));
        this.addTeam(new Team("Blue", new Base(100, new Position(85, 50))));
        console.log(this.teams);
    };

    addTeam (team: Team)
    {
        this.teams[team.id] = team;
    }

    addPlayer (client) {
        var team = this.getTeamIdWithFewestPlayers();

        this.players[client.id] = new Player(
            client.id,
            100,
            1,
            new Position(this.teams[team].base.position.x, this.teams[team].base.position.y),
            team,
            new PlayerInput(true, false, true, false));
        console.log(this.players);
        
        console.log('added player');
    };

    removePlayer (client) {
        delete this.players[client.id]
        console.log('removed player');
    };

    getTeamsAsArray() {
        var teams = this.teams;
        var keysTeams = Object.keys(teams);
    
        var teamsArr = [];
    
        keysTeams.forEach(keyTeam => {
          teamsArr.push(teams[keyTeam]);
        });
    
        return teamsArr;
    };

    getTeamIdWithFewestPlayers() {
        var teams = this.teams;
        var keysTeams = Object.keys(teams);
    
        var players = this.players;
        var keysPlayers = Object.keys(this.players);

        var teamWithFewestPlayers;
        var numberOfPlayersInTeamWithFewestPlayers = Infinity;
    
        keysTeams.forEach(keyTeam => {
          var numberOfPlayersInTeam = 0;
          keysPlayers.forEach(keyPlayer => {
            var isInThisTeam = players[keyPlayer].teamId == keyTeam;
            numberOfPlayersInTeam = isInThisTeam ? numberOfPlayersInTeam + 1 : numberOfPlayersInTeam;
          });
    
          if(teamWithFewestPlayers) {
            teamWithFewestPlayers = numberOfPlayersInTeamWithFewestPlayers > numberOfPlayersInTeam ?
            teams[keyTeam] :
            teamWithFewestPlayers;
            numberOfPlayersInTeamWithFewestPlayers = numberOfPlayersInTeam;
          } else {
            teamWithFewestPlayers = teams[keyTeam];
            numberOfPlayersInTeamWithFewestPlayers = numberOfPlayersInTeam;
          };
        });
    
        return teamWithFewestPlayers.id;
    
    }

    calculateState() {
        this.movePlayers()
    }

    movePlayers() {
        var BASE_MOVE = 0.1;
        //foreach player move in direction he moves defined by his playerinput
        var keysPlayers = Object.keys(this.players);

        
        keysPlayers.forEach(keyPlayer => {
            var distanceToTravel = BASE_MOVE * this.players[keyPlayer].moveSpeed;
            if(this.players[keyPlayer].playerInput.up) {
                this.players[keyPlayer].position.y = Decimal(this.players[keyPlayer].position.y).add(distanceToTravel).toNumber();
            }
            if(this.players[keyPlayer].playerInput.down) {
                this.players[keyPlayer].position.y = Decimal(this.players[keyPlayer].position.y).sub(distanceToTravel).toNumber();
            }
            if(this.players[keyPlayer].playerInput.left) {
                this.players[keyPlayer].position.x = Decimal(this.players[keyPlayer].position.x).sub(distanceToTravel).toNumber();
            }
            if(this.players[keyPlayer].playerInput.right) {
                this.players[keyPlayer].position.x = Decimal(this.players[keyPlayer].position.x).add(distanceToTravel).toNumber();
            }
            
            console.log(this.players[keyPlayer].position)
        });
        
    }

    checkIfCoordinatesInGame(x: number, y:number)
    {
        var xCheck: boolean = false;
        var yCheck: boolean = false;

        if(x <= 100 && x >= 0)
        {
            xCheck = true
        }

        if(y <= 50 && y >= 0)
        {
            yCheck = true;
        }

        return xCheck && yCheck;
    }
};
