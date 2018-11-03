import { Position } from './position';

export class Base {
    public radius: number;
    constructor (
        public health: number,
        public position: Position,
    ) {
        this.health = health;
        this.position = position;
        this.radius = 250;
    }
}
