import { Shape } from "../Shape";
import type { Canvas } from "../../Canvas/Canvas";

export class Rectangle extends Shape {
    
    public constructor(CanvasType: typeof Canvas) {
        super(CanvasType, {height: 100, width: 100});
    }

    protected _hover(): void {
        const size = Shape.outline.hover.size;
        this._ctx.fillStyle = Shape.outline.hover.color;
        this._ctx.fillRect(this.x - size, this.y - size, this.width + size * 2, this.height + size * 2);
        this._draw();
    }

    protected _select(): void {
        const size = Shape.outline.hover.size;
        this._ctx.strokeRect(this.x - size, this.y - size, this.width + size * 2, this.height + size * 2);
    }

    protected _isPointOver(x: number, y: number, boundingRect: DOMRect) {
        const shapeLeftEdge = this.x + boundingRect.left;
        const shapeRightEdge = shapeLeftEdge + this.width;
        const shapeTopEdge = this.y + boundingRect.top;
        const shapeBottomEdge = shapeTopEdge + this.height;

        if (x > shapeLeftEdge && x < shapeRightEdge &&
            y > shapeTopEdge && y < shapeBottomEdge) {
            return true;
        }
        return false;
    }

    protected _draw(): Shape {
        this._ctx.fillStyle = this.color;
        this._ctx.fillRect(this.x, this.y, this.width, this.height);
        // this._ctx.clearRect(45, 45, 60, 60);
        // this._ctx.strokeRect(50, 50, 50, 50);
        // this._ctx.save();

        return this;
    }
}