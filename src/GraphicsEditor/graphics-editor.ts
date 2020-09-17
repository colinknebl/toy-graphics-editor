import { customElement, property, LitElement, html, css, TemplateResult } from 'lit-element';
import { Canvas } from './Canvas/Canvas';
import { Circle } from './Shapes/Circle/Circle';
import { Rectangle } from './Shapes/Rectangle/Rectangle';
import { Shape, ShapeType } from './Shapes/Shape';

@customElement('graphics-editor')
export class CanvasElement extends LitElement {

    private _canvas?: Canvas;
    get canvas(): Canvas | undefined {
        return this._canvas;
    }

    @property()
    public selectedShapes: Shape[] = []

    private _addShape(type: ShapeType): void {
        const shape = Canvas.addShape(type);
        this.canvas?.drawShape(shape);
    }

    private _onAddCircle() {
        this._addShape(ShapeType.circle);
    }

    private _onAddRectangle() {
        this._addShape(ShapeType.rectangle);
    }

    public static get styles() {
        return css`
            .graphics-editor {
                --spacing: .5rem;
                background: whitesmoke;
                border-radius: 5px;
                padding: var(--spacing);
                display: grid;
                grid-template-columns: repeat(3, max-content);
                gap: var(--spacing);
            }

            .graphics-editor__add-shapes-controls {
                display: flex;
                flex-direction: column;
            }

            .canvas-container {
                border: 3px solid #333;
            }

            .shape-editor-container {
                width: 300px;
            }
        `;
    }

    public connectedCallback() {
        super.connectedCallback();
    }

    public firstUpdated() {
        this._canvas = new Canvas(this, this.shadowRoot?.querySelector('canvas') as HTMLCanvasElement);
        (window as any).canvas = this._canvas;
    }

    public render() {
        return html`
            <div class="graphics-editor">
                <div class="graphics-editor__add-shapes-controls">
                    <button @click="${this._onAddCircle}">Add Circle</button>
                    <button @click="${this._onAddRectangle}">Add Rectangle</button>
                </div>
                <div class="canvas-container">
                    <canvas height="500" width="500"></canvas>
                </div>
                <div class="shape-editor-container">
                    ${this.selectedShapes.map(shape => html`
                        <li>
                            <shape-editor .shape=${{shape}}></shape-editor>
                        </li>`
                    )}
                </div>
            </div>
        `;
      }
}

@customElement('shape-editor')
class ShapeEditor extends LitElement {
    @property()
    public shape?: { shape: Shape };
    private _unsubscriber?: {unsubscribe: Function};

    public static get styles() {
        return css`
            .shape-editor {
                color: #333;
                font-size: 1rem;
                font-family: monospace;

                width: 300px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                justify-items: center;
                grid-gap: 10px;
            }

            .shape-type {
                text-align: center;
                margin: 0;
                padding: 5px;
            }

            input:read-only {
                border: none;
                background: inherit;
                text-align: center;
                font-family: inherit;
                font-size: inherit; 
            }
        `;
    }

    firstUpdated() {
        if (!this.shape) return;

        const {shape} = this.shape;

        this._unsubscriber = shape.subscribe((shape) => {
            this.shape = {
                shape
            };
        });
    }

    private _updateColor() {
        if (!this.shape) return;
        const {shape} = this.shape;
        const input = this.shadowRoot?.querySelector('input[type="color"]') as HTMLInputElement;
        shape.color = input.value;
        this.shape = { shape }
    }

    public disconnectedCallback() {
        this._unsubscriber?.unsubscribe();
        super.disconnectedCallback();
    }

    private _updateHeight(height: number) {
        if (!this.shape) return;
        const {shape} = this.shape;
        shape.height = height;
        this.shape = { shape }
    }

    private _updateWidth(width: number) {
        if (!this.shape) return;
        const {shape} = this.shape;
        shape.width = width;
        this.shape = { shape }
    }

    private _updateRadius(radius: number) {
        if (!this.shape || !(this.shape.shape instanceof Circle)) return;
        const { shape } = this.shape;
        shape.radius = radius;
        this.shape = { shape }
    }

    private _getDimensionsEditors(): TemplateResult | void {
        if (!this.shape) return;
        const { shape } = this.shape;
        if (shape instanceof Rectangle) {
            return html`
                <label for="height">height</label>
                <input id="height" type="range" value=${shape.height} min="10" max="400" @input=${(e: InputEvent) => this._updateHeight(Number(e.target?.value))} />
                <label>width</label>
                <input id="width" type="range" value=${shape.width} min="10" max="400" @input=${(e: InputEvent) => this._updateWidth(Number(e.target?.value))} />
            `;
        } else if (shape instanceof Circle) {
            return html`
                <label for="radius">radius</label>
                <input id="radius" type="range" value=${shape.radius} min="10" max="200" @input=${(e: InputEvent) => this._updateRadius(Number(e.target?.value))} />
            `
        } else {
            console.warn('shape not supported');
        }
    }

    public render() {
        const {shape} = this.shape as {shape: Shape};
        return html`
            <div class="shape-editor">
                <button class="delete-button" @click=${() => Canvas.eraseShape(shape.id)}>Delete</button>
                <p class="shape-type">${shape.type}</p>
                <label for="centerX">center x</label>
                <input id="centerX" readonly value=${shape.center.x} />
                <label for="centerY">center y</label>
                <input id="centerY" readonly value=${shape.center.y} />
                ${this._getDimensionsEditors()}
                <label for="color-picker">color</label>
                <input id="color-picker" type="color" value=${this.shape?.shape.color} @input=${() => this._updateColor()} />
            </div>
        `;
      }
}