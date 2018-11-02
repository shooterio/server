import { Position } from './position';

export class Base {
    constructor (
        public health: number,
        public position: Position,
    ) {
        this.health = health;
        this.position = position;
    }
}
