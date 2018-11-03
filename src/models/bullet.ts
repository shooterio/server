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
        public rotation: Number
    ) {
        this.id = shortid.generate();
        this.speed = .7;
        this.radius = .25;
        this.damage =  20;
        this.position = position;
        this.spawnTime = Date.now();
    }
}