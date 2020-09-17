import type { Canvas } from '../Canvas/Canvas';
import type { Shape } from '../Shapes/Shape';
import { Position } from './Position';


export class DraggingEvent {
    
    // ========================================================================
    public initialShapePosition: Position;
    public lastMousePosition: Position = new Position(0, 0)
    public canvasDimensions: {left: number, top: number};
    public mouseOffset: Position;
    public nextPosition?: Position;

    // ========================================================================
    public constructor(initialEvent: MouseEvent, shape: Shape, CanvasType: typeof Canvas) {
        this.lastMousePosition = new Position(initialEvent.clientX, initialEvent.clientY);
        const {top, left} = CanvasType.getBoundingClientRect();
        this.canvasDimensions = {top, left}

        this.initialShapePosition = new Position(left + shape.x, top + shape.y);

        const offsetX = initialEvent.clientX - left - shape.x;
        const offsetY = initialEvent.clientY - top - shape.y;
        this.mouseOffset = new Position(offsetX, offsetY);
    }
    
    // ========================================================================
    public setLastEvent(event: MouseEvent): void {
        this.lastMousePosition = new Position(event.clientX, event.clientY);
        this.nextPosition = new Position(
            this.initialShapePosition.x - this.canvasDimensions.left + this.distanceMoved.x - this.mouseOffset.x,
            this.initialShapePosition.y - this.canvasDimensions.top + this.distanceMoved.y - this.mouseOffset.y
        )
    }

    // ========================================================================
    public get distanceMoved(): Position {
        const distanceMovedX = this.lastMousePosition.x - this.initialShapePosition.x;
        const distancedMovedY = this.lastMousePosition.y - this.initialShapePosition.y;
        return new Position(distanceMovedX, distancedMovedY)
    }
}