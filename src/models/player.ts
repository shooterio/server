import { Position } from './../models/position';
import { PlayerInput } from './../models/playerInput';

export class Player {
    public rotation: number;

    constructor (
        public id: string,
        public health: number,
        public moveSpeed: number,
        public position: Position,
        public teamId: string,
        public playerInput: PlayerInput
    ) {
        this.id = id;
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.position = position;
        this.teamId = teamId;
        this.playerInput = playerInput; 
        this.rotation = Math.round(Math.random() * 360);
    }
}
