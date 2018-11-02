import * as shortid from 'shortid';
import { Position } from './../models/position';

export class Player {

    constructor (
        public id: string,
        public health: number,
        public moveSpeed: number,
        public teamId: string,
    ) {
        this.id = id;
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.teamId = teamId;
    }
}
