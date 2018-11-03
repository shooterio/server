import { EntityMap } from 'colyseus';
import { Player } from '../../models/player';
import { Map } from '../../models/map';
import { Position } from '../../models/position';
import { PlayerInput } from '../../models/playerInput';
import { Team } from '../../models/team';
import { Base } from '../../models/base';

const bullet = require('../../models/bullet');

import * as ActionTypes from './actionTypes';
import { Bullet } from '../../models/bullet';

export class State {
    players: EntityMap<Player> = {};
    teams: EntityMap<Team> = {};
    bullets: EntityMap<Bullet> = {};
    map: Map = new Map(5000, 10000, new Position(5000, 5000));

    constructor () {
        console.log(this.map);
        this.addTeam(new Team("Red", new Base(100, new Position(1500, 5000))));
        this.addTeam(new Team("Blue", new Base(100, new Position(8500, 5000))));
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
            6,
            new Position(this.teams[team].base.position.x, this.teams[team].base.position.y),
            team,
            new PlayerInput(false, false, false, false));
        console.log(this.players);
        
        console.log('added player');
    };

    removePlayer (client) {
        delete this.players[client.id]
        console.log('removed player');
    };

    addBullet (clientid) {
        var bullet: Bullet = new Bullet(
            new Position(this.players[clientid].position.x,
                this.players[clientid].position.y),
                this.players[clientid],
                this.players[clientid].rotation);
                
        bullet.position.x = bullet.position.x + ((this.players[clientid].radius + bullet.radius) * Math.cos((bullet.rotation + 90)*(Math.PI/180)));
        bullet.position.y = bullet.position.y + ((this.players[clientid].radius + bullet.radius) * Math.sin((bullet.rotation+90)*(Math.PI/180)));
        this.bullets[bullet.id] = bullet;
    }

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

    [ActionTypes.MOVE_UP] (clientid, payload) {
        if(payload) {
            this.players[clientid].playerInput.up = payload;
        } else {
            this.players[clientid].playerInput.up = payload;
        }
    }

    [ActionTypes.MOVE_DOWN] (clientid, payload) {
        if(payload) {
            this.players[clientid].playerInput.down = payload;
        } else {
            this.players[clientid].playerInput.down = payload;
        }
    }

    [ActionTypes.MOVE_LEFT] (clientid, payload) {
        if(payload) {
            this.players[clientid].playerInput.left = payload;
        } else {
            this.players[clientid].playerInput.left = payload;
        }
    }

    [ActionTypes.MOVE_RIGHT] (clientid, payload) {
        if(payload) {
            this.players[clientid].playerInput.right = payload;
        } else {
            this.players[clientid].playerInput.right = payload;
        }
    } 
    
    [ActionTypes.SHOOT] (clientid, payload) {
        console.log("shoot");
        this.addBullet(clientid);
    }

    [ActionTypes.PLAYER_ROTATE] (clientid, payload) {
        console.log("player_rotate");
        if(payload < 0) {payload += 360};
        payload = Math.round(payload);
        this.players[clientid].rotation = payload;
    }

    calculateState() {
        this.movePlayers();
        this.calculateBulletMovement();
        this.checkBulletLifeCycle();
        this.collisionHit();
    }

    calculateBulletMovement() {
        var keysBullet = Object.keys(this.bullets);

        keysBullet.forEach((keyBullet) => {
            var bullet = this.bullets[keyBullet];
            bullet.position.x = bullet.position.x + (bullet.speed * Math.cos((bullet.rotation + 90)*(Math.PI/180)));
            bullet.position.y = bullet.position.y + (bullet.speed * Math.sin((bullet.rotation+90)*(Math.PI/180)));
        });
    }

    checkBulletLifeCycle () {
        var keysBullet = Object.keys(this.bullets);

        keysBullet.forEach((keyBullet) => {
            if(Date.now() - this.bullets[keyBullet].spawnTime > 1000) {
                delete this.bullets[keyBullet]; 
            }
        });
    }

    collisionHit () {
        var keysPlayer = Object.keys(this.players);
        var keysBullets = Object.keys(this.bullets);
        var keysTeams = Object.keys(this.teams);

        keysBullets.forEach((keyBullet) => {
            var bullet = this.bullets[keyBullet];

            for(var i = 0; i < keysPlayer.length; i++){
                var key = keysPlayer[i];
                var player = this.players[key];
                var c = Math.sqrt( a*a + b*b );

                var a = bullet.position.x - player.position.x;
                var b = bullet.position.y - player.position.y;

                var distance = Math.sqrt(a*a + b*b);

                if(distance < (bullet.radius + player.radius)) {
                    //HIT
                    this.players[key].health = player.health - bullet.damage;
                    delete this.bullets[keyBullet];
                    if(this.players[key].health <= 0) {
                        var teamSpawn = this.teams[player.teamId].base.position;
                        this.players[key].health = 100;
                        this.players[key].position.x = teamSpawn.x;
                        this.players[key].position.y = teamSpawn.y;
                    }
                    break;
                }
            }

            if(bullet){
                for(var i = 0; i < keysTeams.length; i++){
                    var key = keysTeams[i];
                    var base = this.teams[key].base;
                    var c = Math.sqrt( a*a + b*b );
    
                    var a = bullet.position.x - base.position.x;
                    var b = bullet.position.y - base.position.y;
    
                    var distance = Math.sqrt(a*a + b*b);
    
                    if(distance < (bullet.radius + base.radius)) {
                        //HIT
                        this.teams[key].base.health = base.health - bullet.damage;
                        delete this.bullets[keyBullet];
                        break;
                    }
                }
            }
            
        });
    }

    movePlayers() {
        var BASE_MOVE = 3;
        
        var keysPlayers = Object.keys(this.players);
        
        keysPlayers.forEach(keyPlayer => {
            var distanceToTravel = BASE_MOVE * this.players[keyPlayer].moveSpeed;
            if(this.players[keyPlayer].playerInput.up) {
                if(this.checkIfYUpCoordinatesInGame(this.players[keyPlayer].position.y)){
                    this.players[keyPlayer].position.y = this.players[keyPlayer].position.y + distanceToTravel;
                }
            }
            if(this.players[keyPlayer].playerInput.down) {
                if(this.checkIfYDownCoordinatesInGame(this.players[keyPlayer].position.y)){
                    this.players[keyPlayer].position.y = this.players[keyPlayer].position.y - distanceToTravel;
                }
            }
            if(this.players[keyPlayer].playerInput.left) {
                if(this.checkIfXLeftCoordinatesInGame(this.players[keyPlayer].position.x)){
                    this.players[keyPlayer].position.x = this.players[keyPlayer].position.x - distanceToTravel;
                }
            }
            if(this.players[keyPlayer].playerInput.right) {
                if(this.checkIfXRightCoordinatesInGame(this.players[keyPlayer].position.x)){
                    this.players[keyPlayer].position.x = this.players[keyPlayer].position.x + distanceToTravel;
                }
            }
        });
        
    }

    checkIfXRightCoordinatesInGame(x: number)
    {
        return x < 10000;
    }

    checkIfXLeftCoordinatesInGame(x: number)
    {
        return x > 0;
    }

    checkIfYUpCoordinatesInGame(y:number)
    {
        return y < 7500;
    }

    checkIfYDownCoordinatesInGame(y:number)
    {
        return y > 2500;
    }
};
