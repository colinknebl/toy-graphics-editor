import type { Canvas } from '../Canvas/Canvas';
import { DraggingEvent } from '../lib/DraggingEvent';
import { Position } from '../lib/Position';

export enum ShapeType {
  circle,
  rectangle,
}

export abstract class Shape {
  // ========================================================================
  public static Canvas: typeof Canvas;

  // ========================================================================
  public static setWidth(shape: Shape, width: number): void {
    shape.#width = width;
    Shape.Canvas.redraw();
  }

  // ========================================================================
  public static setHeight(shape: Shape, height: number): void {
    shape.#height = height;
    Shape.Canvas.redraw();
  }

  // ========================================================================
  public static setColor(shape: Shape, color: string): void {
    shape.#color = color;
    Shape.draw(shape);
  }

  // ========================================================================
  public static select(shape: Shape): void {
    shape.#isSelected = true;
    shape._ctx.lineWidth = Shape.outline.size;
    shape._ctx.strokeStyle = Shape.outline.select.color;
    shape.select();
  }

  // ========================================================================
  public static unselect(shape: Shape): void {
    shape.#isSelected = false;
    Shape.Canvas.redraw();
  }

  // ========================================================================
  public static unhover(shape: Shape): void {
    shape.#isHoveredOver = false;
    Shape.Canvas.redraw();
  }

  // ========================================================================
  public static hover(shape: Shape): void {
    if (shape.#isHoveredOver) return;
    shape.#isHoveredOver = true;
    shape.hover();
  }

  // ========================================================================
  public static endDrag(shape: Shape): void {
    shape.#draggingEvent = undefined;
  }

  // ========================================================================
  public static erase(shape: Shape): void {
    Shape.Canvas.eraseShape(shape.id);
  }

  // ========================================================================
  public static draw(shape: Shape): Shape {
    shape.draw();

    if (shape.#isHoveredOver) {
      shape.hover();
    }

    if (shape.#isSelected) {
      Shape.select(shape);
    }

    return shape;
  }

  // ========================================================================
  public static readonly outline = {
    size: 3,
    hover: {
      color: 'rgba(24, 117, 255, 0.55)',
    },
    select: {
      color: 'gold',
    },
  };

  // ========================================================================
  private static _nextId = 0;
  private static _getId(): number {
    const id = Date.now() + Shape._nextId;
    Shape._nextId++;
    return id;
  }

  // ========================================================================
  #id: number;
  #x: number;
  #y: number;
  #height: number;
  #width: number;
  #color: string = '#000000';
  #draggingEvent?: DraggingEvent;
  #isSelected: boolean = false;
  #isHoveredOver: boolean = false;

  // ========================================================================
  public constructor(options?: Shape.Options) {
    this.#x = options?.x ?? 0;
    this.#y = options?.y ?? 0;
    this.#height = options?.height ?? 0;
    this.#width = options?.width ?? 0;
    this.#id = Shape._getId();
  }

  // ========================================================================
  protected abstract draw(): Shape;
  protected abstract hover(): void;
  protected abstract select(): void;
  public abstract isPointOver(x: number, y: number): boolean;

  // ========================================================================
  protected get _ctx() {
    return new Shape.Canvas().ctx;
  }

  // ========================================================================
  protected get _shouldHover(): boolean {
    return !this.#isHoveredOver;
  }

  // ========================================================================
  public get type(): string {
    return this.constructor.name;
  }

  // ========================================================================
  public get id(): number {
    return this.#id;
  }

  // ========================================================================
  public get x(): number {
    return this.#x;
  }

  // ========================================================================
  public get y(): number {
    return this.#y;
  }

  // ========================================================================
  public get height(): number {
    return this.#height;
  }

  // ========================================================================
  public get width(): number {
    return this.#width;
  }
  // ========================================================================
  public get color(): string {
    return this.#color;
  }

  // ========================================================================
  public get center(): Position {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    return new Position(centerX, centerY);
  }

  // ========================================================================
  public get isDragging(): boolean {
    return Boolean(this.#draggingEvent);
  }

  // ========================================================================
  public get isSelected(): boolean {
    return this.#isSelected;
  }

  // ========================================================================
  public get isHoveredOver(): boolean {
    return this.#isHoveredOver;
  }

  // ========================================================================
  public handleMoveEvent(event: MouseEvent): void {
    if (!this.#draggingEvent) {
      this.#draggingEvent = new DraggingEvent(event, this, Shape.Canvas);
      return;
    } else {
      this.#draggingEvent.setLastEvent(event);
    }

    this.#x = this.#draggingEvent?.nextPosition?.x as number;
    this.#y = this.#draggingEvent?.nextPosition?.y as number;
    Shape.Canvas.moveShape(this);
  }
}

// ========================================================================
export declare namespace Shape {
  // ========================================================================
  interface Options {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  }

  // ========================================================================
  type MoveToOptions = DraggingEvent;

  // ========================================================================
  interface MoveToReturn {
    x: number;
    y: number;
  }
}
