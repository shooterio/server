import { EntityMap } from 'colyseus';
import { Player } from '../../models/player';
import { Map } from '../../models/map';
import { Position } from '../../models/position';
import { Team } from '../../models/team';
import { Base } from '../../models/base';

export class State {
    players: EntityMap<Player> = {};
    teams: EntityMap<Team> = {};
    map: Map = new Map(50, 100, new Position(50, 50));


    constructor () {
        console.log(this.map);
        this.addTeam(new Team("Red", new Base(100, new Position(75, 75))));
        this.addTeam(new Team("Blue", new Base(100, new Position(75, 125))));
        console.log(this.teams);
    };

    addTeam (team: Team)
    {
        this.teams[team.id] = team;
    }

    addPlayer (client) {
        var countTeamRed: Number;
        var countTeamBlue: Number;

        var team = this.getTeamIdWithFewestPlayers();

        this.players[client.id] = new Player(client.id, 100, 1, team);
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

    calculateState () {

    };
};
