import { Shape } from "../Shape";
import type { Canvas } from "../../Canvas/Canvas";

export class Circle extends Shape {
    private static _offsetX = 10;
    private static _offsetY = 10;

    #radius: number = 10;

    public constructor(CanvasType: typeof Canvas) {
        super(CanvasType);
    }

    public get height(): number {
        return this.#radius * 2;
    }

    public get width(): number {
        return this.#radius * 2;
    }

    protected _hover(): void {
        this._ctx.beginPath();
        const x = this.x + Circle._offsetX;
        const y = this.y + Circle._offsetY;
        this._ctx.arc(x, y, this.#radius + Shape.outline.hover.size, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fillStyle = Shape.outline.hover.color;
        this._ctx.fill();
        this._draw();
    }

    protected _select(): void {
        this._ctx.beginPath();
        const x = this.x + Circle._offsetX;
        const y = this.y + Circle._offsetY;
        this._ctx.arc(x, y, this.#radius + (Shape.outline.select.size * 2), 0, Math.PI * 2, true);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    protected _isPointOver(x: number, y: number, boundingRect: DOMRect): boolean {
        const canvasPosition = boundingRect;

        const position = { 
                x: canvasPosition.left + this.x,
                y: canvasPosition.top + this.y
            },
            size   = { height: this.#radius * 2, width: this.#radius * 2},
            radius = this.#radius,
            centerX = position.x + (size.width / 2),
            centerY = position.y + (size.height / 2),
            distanceX = x - centerX,
            distanceY = y - centerY;
			
		return Math.round(Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))) <= radius;  
    }

    protected _draw(): Shape {
        this._ctx.beginPath();
        const x = this.x + Circle._offsetX;
        const y = this.y + Circle._offsetY;
        this._ctx.arc(x, y, this.#radius, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fillStyle = 'red' //this.color;
        this._ctx.fill();

        return this;
    }
}