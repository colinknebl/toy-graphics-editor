import type { Canvas } from "../Canvas/Canvas";

export enum ShapeType {
    circle,
    rectangle
}

export abstract class Shape {
    public static outline = {
        hover: {
            size: 6,
            color: 'rgba(24, 117, 255, 0.55)'
        },
        select: {
            size: 3,
            color: 'gold'
        }
    };

    private static _nextId = 0;
    private static _getId(): number {
        const id = Date.now() + Shape._nextId;
        Shape._nextId++;
        return id;
    }

    #id: number;
    #x: number;
    #y: number;
    #height: number;
    #width: number;
    #Canvas: typeof Canvas;
    #color: string = '#000000';
    #draggingEvent?: DraggingEvent;
    #isSelected: boolean = false;
    #isHoveredOver: boolean = false;
    #isHoverOutlineApplied: boolean = false;

    constructor(CanvasType: typeof Canvas, options?: Shape.Options) {
        this.#Canvas = CanvasType;
        this.#x = options?.x ?? 0;
        this.#y = options?.y ?? 0;
        this.#height = options?.height ?? 0;
        this.#width = options?.width ?? 0;
        this.#id = Shape._getId();
    }
    
    protected get _ctx() {
        return new this.#Canvas().ctx;
    }

    public get isDragging(): boolean {
        return Boolean(this.#draggingEvent);
    }

    public get isSelected(): boolean {
        return this.#isSelected;
    }

    public get isHoveredOver(): boolean {
        return this.#isHoveredOver;
    }

    protected abstract _draw(): Shape;
    public draw(): Shape {
        this._draw();

        if (this.isHoveredOver) {
            this._hover();
        }

        if (this.#isSelected) {
            this.select();
        }

        return this;
    }

    public erase(): void {
        this.#Canvas.eraseShape(this.id);
    }

    public handleMoveEvent(event: MouseEvent): void {
        if (!this.#draggingEvent) {
            this.#draggingEvent = new DraggingEvent(event, this, this.#Canvas);
            return;
        } else {
            this.#draggingEvent.setLastEvent(event);
        }

        this.#x = this.#draggingEvent?.nextPosition?.x as number;
        this.#y = this.#draggingEvent?.nextPosition?.y as number;
        this.#Canvas.moveShape(this);
    }

    public get Canvas(): typeof Canvas {
        return this.#Canvas;
    }

    protected abstract _hover(): void;
    public hover(): void {
        this.#isHoveredOver = true;
        if (this.#isHoverOutlineApplied) return;
        this._ctx.lineWidth = Shape.outline.hover.size;
        this._ctx.strokeStyle = Shape.outline.hover.color;
        this._hover();
        this.#isHoverOutlineApplied = true;
    }

    public unhover(): void {
        this.#isHoveredOver = false;
        this.#isHoverOutlineApplied = false;
        this.#Canvas.redraw();
    }

    protected abstract _isPointOver(x: number, y: number, boundingRect: DOMRect): boolean;
    public isPointOver(x: number, y: number): boolean {
        return this._isPointOver(x, y, this.#Canvas.getBoundingClientRect());;
    }

    protected abstract _select(): void;
    public select(): void {
        this.#isSelected = true;
        this._ctx.lineWidth = Shape.outline.select.size;
        this._ctx.strokeStyle = Shape.outline.select.color;
        this._select();
    }

    public unselect(): void {
        this.#isSelected = false;
        this.#Canvas.redraw();
    }

    public endDrag(): void {
        this.#draggingEvent = undefined;
    }

    public get type(): string {
        return this.constructor.name;
    }

    public get id(): number {
        return this.#id;
    }

    public get x(): number {
        return this.#x;
    }

    public get y(): number {
        return this.#y;
    }

    public get height(): number {
        return this.#height;
    }

    public set height(height: number) {
        this.#height = height;
        this.#Canvas.redraw();
    }

    public get width(): number {
        return this.#width;
    }

    public set width(width: number) {
        this.#width = width;
        this.#Canvas.redraw();
    }

    public get color(): string {
        return this.#color;
    }

    public set color(color: string) {
        this.#color = color;
        this.draw();
    }

    public get center(): Position {
        const centerX = this.x + (this.width / 2);
        const centerY = this.y + (this.height / 2);
        return new Position(centerX, centerY);
    }

    public getColor(): string {
        return this.#color;
    }
}

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

class DraggingEvent {
    #position: Position;
    
    #initialEvent: MouseEvent;
    #lastEvent?: MouseEvent;
    #shape: Shape;

    public initialShapePosition: Position;
    public lastMousePosition: Position = new Position(0, 0)
    public canvasDimensions: {left: number, top: number};
    public mouseOffset: Position;
    public nextPosition?: Position;

    constructor(initialEvent: MouseEvent, shape: Shape, CanvasType: typeof Canvas) {
        this.#initialEvent = initialEvent;
        this.lastMousePosition = new Position(initialEvent.clientX, initialEvent.clientY);

        this.#shape = shape;
        const {top, left} = CanvasType.getBoundingClientRect();
        this.canvasDimensions = {top, left}
        
        this.#position = new Position(initialEvent.clientX, initialEvent.clientY);

        this.initialShapePosition = new Position(left + shape.x, top + shape.y);

        const offsetX = initialEvent.clientX - left - shape.x;
        const offsetY = initialEvent.clientY - top - shape.y;
        this.mouseOffset = new Position(offsetX, offsetY);
    }
    

    public setLastEvent(event: MouseEvent): void {
        this.#lastEvent = event;
        this.lastMousePosition = new Position(event.clientX, event.clientY);
        this.nextPosition = new Position(
            this.initialShapePosition.x - this.canvasDimensions.left + this.distanceMoved.x - this.mouseOffset.x,
            this.initialShapePosition.y - this.canvasDimensions.top + this.distanceMoved.y - this.mouseOffset.y
        )
    }

    public get distanceMoved(): Position {
        const distanceMovedX = this.lastMousePosition.x - this.initialShapePosition.x;
        const distancedMovedY = this.lastMousePosition.y - this.initialShapePosition.y;
        return new Position(distanceMovedX, distancedMovedY)
    }

    public log() {
        console.log({
            initialShapePosition: {
                x: this.initialShapePosition.x,
                y: this.initialShapePosition.y
            },
            lastMousePosition: {
                x: this.lastMousePosition.x,
                y: this.lastMousePosition.y
            },
            canvasDimensions: {
                ...this.canvasDimensions
            }
        })
    }
}

export declare namespace Shape {
    interface Options {
        x?: number;
        y?: number;
        height?: number;
        width?: number;
    }

    type MoveToOptions = DraggingEvent;

    interface MoveToReturn {
        x: number;
        y: number;
    }
}