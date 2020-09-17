export class Position {
    #x: number;
    #y: number;

    public constructor(x: number, y: number) {
        this.#x = Math.round(x);
        this.#y = Math.round(y);
    }

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }
}