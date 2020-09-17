import { customElement, property, LitElement, html, css, TemplateResult } from 'lit-element';
import { Canvas } from './Canvas/Canvas';
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
        const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
        this.shape.shape.color = input.value;
    }

    public disconnectedCallback() {
        this._unsubscriber?.unsubscribe();
        super.disconnectedCallback();
    }

    public render() {
        const {shape} = this.shape as {shape: Shape};
        return html`
            <div class="shape-editor">
                <button class="delete-button" @click=${() => Canvas.eraseShape(shape.id)}>Delete</button>
                <p class="shape-type">${shape?.constructor.name}</p>
                <span>center x</span>
                <span>${shape.center.x}</span>
                <span>center y</span>
                <span>${shape.center.y}</span>
                <span>color</span>
                <input type="color" value=${this.shape?.shape.color} @input=${() => this._updateColor()} />
            </div>
        `;
      }
}