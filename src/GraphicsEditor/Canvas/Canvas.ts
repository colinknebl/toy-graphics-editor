import type { CanvasElement } from "../graphics-editor";
import { Circle } from "../Shapes/Circle/Circle";
import { Rectangle } from "../Shapes/Rectangle/Rectangle";
import { Shape, ShapeType } from "../Shapes/Shape";

export class Canvas {

    // ========================================================================
    private static _instance?: Canvas;

    // ========================================================================
    public static getBoundingClientRect(): DOMRect {
        return Canvas._instance?.el.getBoundingClientRect() ?? new DOMRect();
    }

    // ========================================================================
    public static get height(): number {
        return Canvas._instance?.el.height ?? 0;
    }

    // ========================================================================
    public static get width(): number {
        return Canvas._instance?.el.width ?? 0;
    }

    // ========================================================================
    public static fillShape(type: ShapeType): Shape {
        if (!Canvas._instance) throw new Error('Cannot write shape to canvas - canvas undefined!');
        let shape: Shape;
        if (type === ShapeType.circle) {
            shape = new Circle();
        } else if (type === ShapeType.rectangle) {
            shape = new Rectangle();
        } else {
            throw new Error('Unsupported shape type');
        }

        Canvas._instance.#shapeEntries.set(shape.id, shape);
        Shape.draw(shape);
        return shape;
    }

    // ========================================================================
    public static get ctx(): CanvasRenderingContext2D {
        return Canvas._instance?.ctx as CanvasRenderingContext2D;
    }

    // ========================================================================
    public static eraseShape(shapeId: number): void {
        const canvas = Canvas._instance;
        if (!canvas) return;
        canvas.#shapeEntries.delete(shapeId);
        Canvas.redraw();
    }

    // ========================================================================
    public static moveShape(shape: Shape): void {
        const canvas = Canvas._instance;
        if (!canvas) return;
        canvas.#shapeEntries.set(shape.id, shape);
        Canvas.redraw();
    }

    // ========================================================================
    public static redraw(): void {
        if (!Canvas._instance) return;
        // clear the canvas
        Canvas._instance.ctx.clearRect(0, 0, Canvas.height, Canvas.width);

        for (let shape of Canvas._instance._shapesArray) {
            Shape.draw(shape);
        }
        Canvas._instance.#canvasCustomEl.shapes = Canvas._instance._shapesArray;
    }

    // ========================================================================
    public static updateSelectedShapeEditors(): void {
        if (!Canvas._instance) return;
        Canvas._instance.#canvasCustomEl.shapes = Canvas._instance._shapesArray;
    }

    // ========================================================================
    #el!: HTMLCanvasElement;
    #canvasCustomEl!: CanvasElement;
    #shapeEntries: Map<number, Shape> = new Map();
    #isMouseDown: boolean = false;

    // ========================================================================
    public constructor(canvas?: CanvasElement, element?: HTMLCanvasElement) {      
        if (Canvas._instance) {
            return Canvas._instance;
        } else {
            Canvas._instance = this;
        }

        Shape.Canvas = Canvas;

        if (!element) throw 'Element not provided';
        if (!canvas) throw 'Canvas not provided';

        this.#canvasCustomEl = canvas;
        this.#el = element;
        this.#el.addEventListener('mousemove', this._onMouseMove);
        this.#el.addEventListener('mousedown', this._onMouseDown);
        this.#el.addEventListener('mouseup', this._onMouseUp);   
    }

    // ========================================================================
    private _onMouseUp = (event: MouseEvent): void => {
        this.#isMouseDown = false;

        this._shapesArray.reverse().map(shape => {
            Shape.endDrag(shape);
        });
    }

    // ========================================================================
    private get _shapesArray(): Shape[] {
        return Array.from(this.#shapeEntries.values());
    }

    // ========================================================================
    private _onMouseDown = (event: MouseEvent): void => {
        this.#isMouseDown = true;

        let oneIsSelected = false;
        this._shapesArray.reverse().map(shape => {

            if (shape.isPointOver(event.clientX, event.clientY) && !oneIsSelected) {
                Shape.select(shape);
                oneIsSelected = true;
            } else if (!event.shiftKey) {
                Shape.unselect(shape);
            }
        });

        Canvas.updateSelectedShapeEditors();
    }

    // ========================================================================
    private _onMouseMove = (event: MouseEvent): void => {
        let oneIsHovered = false;

        this._shapesArray.reverse().map(shape => {
                
            // if the mouse is over the shape, hover
            if (!oneIsHovered && shape.isPointOver(event.clientX, event.clientY)) {
                Shape.hover(shape)
                oneIsHovered = true;
            } else {
                Shape.unhover(shape);
            }
            
            // if the mouse is selected, handleMouseMoveEvent
            if (this.#isMouseDown && shape.isSelected) {
                shape.handleMoveEvent(event);
            }
        });
    }

    // ========================================================================
    public get ctx(): CanvasRenderingContext2D {
        return this.#el.getContext('2d') as CanvasRenderingContext2D;
    }

    // ========================================================================
    public get el(): HTMLCanvasElement {
        return this.#el;
    }

    // ========================================================================
    public get shapes() {
        return this.#shapeEntries;
    }

    // ========================================================================
    public getShapeById(shapeId: number): Shape | undefined {
        return this.#shapeEntries.get(shapeId);
    }

    // ========================================================================
    public cleanup(): void {
        this.#el.removeEventListener('mousemove', this._onMouseMove);
        this.#el.removeEventListener('mousedown', this._onMouseDown);
        this.#el.removeEventListener('mouseup', this._onMouseUp);
    }
}