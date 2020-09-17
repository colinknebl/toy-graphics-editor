import { Shape } from "../Shape";
import { Position } from '../../lib/Position';
import type { Canvas } from "../../Canvas/Canvas";

export class Circle extends Shape {
    private static _offset = 50;

    #radius: number = Circle._offset;

    public constructor(CanvasType: typeof Canvas) {
        super(CanvasType);
    }

    public get radius(): number {
        return this.#radius;
    }

    public set radius(radius: number) {
        this.#radius = radius;
        this.Canvas.redraw();
    }

    public get height(): number {
        return this.#radius * 2;
    }

    public get width(): number {
        return this.#radius * 2;
    }

    protected _hover(): void {
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius + Shape.outline.hover.size, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fillStyle = Shape.outline.hover.color;
        this._ctx.fill();
        this._draw();
    }

    protected _select(): void {
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius + (Shape.outline.select.size * 2), 0, Math.PI * 2, true);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    protected _isPointOver(x: number, y: number, boundingRect: DOMRect): boolean {
        const centerX = this.center.x + boundingRect.left;
        const centerY = this.center.y + boundingRect.top;
        const deltaX = Math.pow(x - centerX, 2);
        const deltaY = Math.pow(y - centerY, 2);
        return Math.sqrt(deltaX + deltaY) <= this.radius;
    }

    public get center(): Position {
        const centerX = this.x + Circle._offset;
        const centerY = this.y + Circle._offset;
        return new Position(centerX, centerY);
    }

    protected _draw(): Shape {
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius, 0, Math.PI * 2, true);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
        

        return this;
    }
}