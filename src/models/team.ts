import * as shortid from 'shortid';
import { Base } from './base';

export class Team {

    public id: string;
    
    constructor (
        public name: string,
        public base: Base,
    ) {
        this.id = shortid.generate();
        this.name = name;
        this.base = base;
    }
}
