import { Shape } from "../Shape";
import { Position } from '../../lib/Position';

export class Circle extends Shape {

    // ========================================================================
    private static _offset = 50;

    // ========================================================================
    public static setRadius(circle: Circle, radius: number): void {
        circle.#radius = radius;
        Shape.Canvas.redraw();
    }

    // ========================================================================
    #radius: number = Circle._offset;

    // ========================================================================
    protected hover(): void {
        const size = Shape.outline.size;
        this._ctx.lineWidth = size * 2;
        this._ctx.strokeStyle = Shape.outline.hover.color;
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius + size, 0, Math.PI * 2, true);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    // ========================================================================
    protected select(): void {
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius + (Shape.outline.size * 2) + 1, 0, Math.PI * 2, true);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    // ========================================================================
    protected _isPointOver(x: number, y: number, boundingRect: DOMRect): boolean {
        const centerX = this.center.x + boundingRect.left;
        const centerY = this.center.y + boundingRect.top;
        const deltaX = Math.pow(x - centerX, 2);
        const deltaY = Math.pow(y - centerY, 2);
        return Math.sqrt(deltaX + deltaY) <= this.radius;
    }

    // ========================================================================
    protected draw(): Shape {
        this._ctx.beginPath();
        const x = this.x + Circle._offset;
        const y = this.y + Circle._offset;
        this._ctx.arc(x, y, this.#radius, 0, Math.PI * 2, true);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
    
        return this;
    }

    // ========================================================================
    public get center(): Position {
        const centerX = this.x + Circle._offset;
        const centerY = this.y + Circle._offset;
        return new Position(centerX, centerY);
    }

    // ========================================================================
    public get radius(): number {
        return this.#radius;
    }

    // ========================================================================
    public get height(): number {
        return this.#radius * 2;
    }

    // ========================================================================
    public get width(): number {
        return this.#radius * 2;
    }
}