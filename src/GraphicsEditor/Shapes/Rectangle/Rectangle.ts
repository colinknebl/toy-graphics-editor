import { Shape } from '../Shape';

export class Rectangle extends Shape {
  // ========================================================================
  public constructor() {
    super({ height: 100, width: 100 });
  }

  // ========================================================================
  protected hover(): void {
    const size = Shape.outline.size;
    this._ctx.lineWidth = size * 2;
    this._ctx.strokeStyle = Shape.outline.hover.color;
    this._ctx.strokeRect(
      this.x - size,
      this.y - size,
      this.width + size * 2,
      this.height + size * 2,
    );
  }

  // ========================================================================
  protected select(): void {
    const size = Shape.outline.size + 1;
    this._ctx.strokeRect(
      this.x - size * 2,
      this.y - size * 2,
      this.width + size * 4,
      this.height + size * 4,
    );
  }

  // ========================================================================
  protected draw(): Shape {
    this._ctx.fillStyle = this.color;
    this._ctx.fillRect(this.x, this.y, this.width, this.height);
    return this;
  }

  // ========================================================================
  public isPointOver(
    x: number,
    y: number,
    canvasRect = Shape.Canvas.getBoundingClientRect(),
  ): boolean {
    const shapeLeftEdge = this.x + canvasRect.left;
    const shapeRightEdge = shapeLeftEdge + this.width;
    const shapeTopEdge = this.y + canvasRect.top;
    const shapeBottomEdge = shapeTopEdge + this.height;

    if (
      x > shapeLeftEdge &&
      x < shapeRightEdge &&
      y > shapeTopEdge &&
      y < shapeBottomEdge
    ) {
      return true;
    }
    return false;
  }
}
