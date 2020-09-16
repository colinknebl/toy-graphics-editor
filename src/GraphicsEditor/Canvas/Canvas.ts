import { Circle } from "../Shapes/Circle/Circle";
import { Rectangle } from "../Shapes/Rectangle/Rectangle";
import { Shape, ShapeType } from "../Shapes/Shape";

export class Canvas {

    public static getBoundingClientRect(): DOMRect {
        return Canvas._instance?.el.getBoundingClientRect() ?? new DOMRect();
    }

    public static get height(): number {
        return Canvas._instance?.el.height ?? 0;
    }

    public static get width(): number {
        return Canvas._instance?.el.width ?? 0;
    }

    public static addShape(type: ShapeType): Shape {
        if (type === ShapeType.circle) {
            return new Circle(Canvas);
        } else if (type === ShapeType.rectangle) {
            return new Rectangle(Canvas);
        } else {
            throw new Error('Unsupported shape type');
        }
    }

    public static get ctx(): CanvasRenderingContext2D {
        return Canvas._instance?.ctx as CanvasRenderingContext2D;
    }

    public static eraseShape(shapeId: number): void {
        const canvas = Canvas._instance;
        if (!canvas) return;
        canvas.#shapeEntries.delete(shapeId);
        canvas._redraw();
    }

    public static moveShape(shape: Shape): void {
        const canvas = Canvas._instance;
        if (!canvas) return;
        canvas.#shapeEntries.set(shape.id, shape);
        canvas._redraw();
    }

    public static redraw(): void {
        Canvas._instance?._redraw();
    }


    private static _instance?: Canvas;
    #el!: HTMLCanvasElement;
    #shapeEntries: Map<number, Shape> = new Map();
    #isMouseDown: boolean = false;

    public constructor(element?: HTMLCanvasElement) {      
        if (Canvas._instance) {
            return Canvas._instance;
        } else {
            Canvas._instance = this;
        }

        if (!element) throw 'Element not provided';

        this.#el = element;
        this.#el.addEventListener('mousemove', this._onMouseMove);
        this.#el.addEventListener('mousedown', this._onMouseDown);
        this.#el.addEventListener('mouseup', this._onMouseUp);   
    }

    private _onMouseUp = (event: MouseEvent): void => {
        this.#isMouseDown = false;

        this._shapesArray.reverse().map(shape => {
            shape.endDrag();
        });
    }

    private _isPointOverShape(x: number, y: number): boolean {
        return this._shapesArray.some(shape => shape.isPointOver(x, y));
    }

    private _unselectAllShapes(): void {
        this._shapesArray.forEach(shape => shape.unselect());
    }

    private get _shapesArray(): Shape[] {
        return Array.from(this.#shapeEntries.values());
    }

    private _onMouseDown = (event: MouseEvent): void => {
        this.#isMouseDown = true;
    
        const isPointOverShape = this._isPointOverShape(event.clientX, event.clientY);

        if (!isPointOverShape) 
            return this._unselectAllShapes();

        this._shapesArray.reverse().map(shape => {

            if (shape.isPointOver(event.clientX, event.clientY)) {
                shape.select();
            } else if (event.shiftKey &&  shape.isSelected) {
                shape.select();
            } else {
                shape.unselect();
            }
        });
    }

    private _onMouseMove = (event: MouseEvent): void => {
        this._shapesArray.reverse().map(shape => {
                
            // if the mouse is over the shape, hover
            if (shape.isPointOver(event.clientX, event.clientY)) {
                    shape.hover();
            } else {
                shape.unhover();
            }
            
            // if the mouse is selected, handleMouseMoveEvent
            if (this.#isMouseDown && shape.isSelected) {
                shape.handleMoveEvent(event);
            }
        });
    }

    private _redraw(): void {
        // clear the canvas
        this.ctx.clearRect(0, 0, Canvas.height, Canvas.width);

        for (let shape of this.#shapeEntries.values()) {
            shape.draw();
        }
    }

    public get ctx(): CanvasRenderingContext2D {
        return this.#el.getContext('2d') as CanvasRenderingContext2D;
    }

    public get el(): HTMLCanvasElement {
        return this.#el;
    }

    public get shapes() {
        return this.#shapeEntries;
    }

    public drawShape(shape: Shape): Shape {
        shape.draw();
        this.ctx.fillStyle = 'black';

        this.#shapeEntries.set(shape.id, shape);

        (window as any).lastShape = shape;
        return shape;
    }

    public getShapeById(shapeId: number): Shape | undefined {
        return this.#shapeEntries.get(shapeId);
    }

    public cleanup(): void {
        this.#el.removeEventListener('mousemove', this._onMouseMove);
        this.#el.removeEventListener('mousedown', this._onMouseDown);
        this.#el.removeEventListener('mouseup', this._onMouseUp);
    }
}