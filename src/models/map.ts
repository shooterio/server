import * as shortid from 'shortid';
import {Position} from './position';

export class Map {
    constructor (
        public height: number,
        public width: number,
        public position: Position,
    ) {
        this.height = height;
        this.width = width;
        this.position = position;
    }
}
