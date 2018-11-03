export class PlayerInput {
    constructor (
        public up: boolean,
        public down: boolean,
        public left: boolean,
        public right: boolean
    ) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
    }
}
