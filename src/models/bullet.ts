import { Position } from './position';
import * as shortid from 'shortid';
import { Player } from './player';

export class Bullet {
    public id: string;
    public damage: number;
    public speed: number;
    public radius: number;
    public spawnTime: any;

    constructor (
        public position: Position,
        public owner: Player,
        public rotation: number
    ) {
        this.id = shortid.generate();
        this.speed = 50;
        this.radius = 50;
        this.damage =  1;
        this.position = position;
        this.spawnTime = Date.now();
    }
}