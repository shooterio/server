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
        this.speed = 3;
        this.radius = .25;
        this.damage =  20;
        this.position = position;
        this.spawnTime = Date.now();
    }
}