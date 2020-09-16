import type { Canvas } from "../Canvas/Canvas";

export enum ShapeType {
    circle,
    rectangle
}

export abstract class Shape {
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
    #color: string = 'black';
    #draggingEvent?: DraggingEvent;
    #isSelected: boolean = false;
    #isHoveredOver: boolean = false;

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

    public set isSelected(selected: boolean) {
        this.#isSelected = selected;
    }

    public hover(): void {
        this.#isHoveredOver = true;
        this.outline();
    }

    public unhover(): void {
        this.#isHoveredOver = false;
        this.#Canvas.redraw();
    }

    protected abstract _draw(): Shape;
    public draw(): Shape {
        this._draw();

        if (this.isHoveredOver) {
            this._outline();
        }

        return this;
    }

    public erase(): void {
        this._ctx.clearRect(this.x, this.y, this.height, this.width);
        this.#Canvas.eraseShape(this.id);
    }

    public handleMoveEvent(event: MouseEvent): void {
        this.#draggingEvent?.setLastEvent(event);

        this.#x = this.#draggingEvent?.nextPosition?.x ?? 0;
        this.#y = this.#draggingEvent?.nextPosition?.y ?? 0;
        this.#Canvas.moveShape(this);
    }

    protected abstract _outline(): void;
    public outline(): void {
        this._outline();
    }

    public get Canvas(): typeof Canvas {
        return this.#Canvas;
    }

    protected abstract _isMouseOver(x: number, y: number, boundingRect: DOMRect): boolean;
    public isMouseOver(x: number, y: number): boolean {
        return this._isMouseOver(x, y, this.#Canvas.getBoundingClientRect());;
    }

    public initDrag(event: MouseEvent): void {
        this.#draggingEvent = new DraggingEvent(event, this, this.#Canvas);
    }

    public endDrag(): void {
        this.#draggingEvent = undefined;
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

    public get width(): number {
        return this.#width;
    }

    public get color(): string {
        return this.#color;
    }
}

class Position {
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