import { Position } from './../models/position';
import { PlayerInput } from './../models/playerInput';

export class Player {

    constructor (
        public id: string,
        public health: number,
        public moveSpeed: number,
        public position: Position,
        public teamId: string,
        public playerInput: PlayerInput,
        //public rotation: Number,
    ) {
        this.id = id;
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.position = position;
        this.teamId = teamId;
        this.playerInput = playerInput; 
        //this.rotation = Math.random() * 360;
    }
}
