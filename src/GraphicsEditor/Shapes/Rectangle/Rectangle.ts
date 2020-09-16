import { Shape } from "../Shape";
import type { Canvas } from "../../Canvas/Canvas";

export class Rectangle extends Shape {
    
    public constructor(CanvasType: typeof Canvas) {
        super(CanvasType, {height: 100, width: 100});
    }

    protected _outline(): void {
        this._ctx.strokeStyle = 'lime';
        this._ctx.strokeRect(this.x - 4, this.y - 4, this.height + 8, this.width + 8);
    }

    protected _isMouseOver(x: number, y: number, boundingRect: DOMRect) {
        const canvasPosition = boundingRect;
        const shapeLeftEdge = this.x + canvasPosition.left;
        const shapeRightEdge = this.x + canvasPosition.left + this.width;
        const shapeTopEdge = this.y + canvasPosition.top;
        const shapeBottomEdge = this.y + canvasPosition.top + this.height;

        if (x > shapeLeftEdge && x < shapeRightEdge &&
            y > shapeTopEdge && y < shapeBottomEdge) {
            return true;
        }
        return false;
    }

    protected _draw(): Shape {
        this._ctx.fillStyle = this.color;
        this._ctx.fillRect(this.x, this.y, this.height, this.width);
        // this._ctx.clearRect(45, 45, 60, 60);
        // this._ctx.strokeRect(50, 50, 50, 50);
        // this._ctx.save();

        return this;
    }
}