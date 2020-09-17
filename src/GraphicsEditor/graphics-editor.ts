import { customElement, property, LitElement, html, css, TemplateResult } from 'lit-element';
import { Canvas } from './Canvas/Canvas';
import { Shape, ShapeType } from './Shapes/Shape';

import './selected-shapes';
import './shape-editor';

@customElement('graphics-editor')
export class CanvasElement extends LitElement {

    private _canvas?: Canvas;
    get canvas(): Canvas | undefined {
        return this._canvas;
    }

    @property()
    public shapes: Shape[] = []

    private _addShape(type: ShapeType): void {
        const shape = Canvas.initShape(type);
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

            selected-shapes {
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
                <selected-shapes .selectedShapes=${{shapes: this.shapes.filter(s => s.isSelected)}}></selected-shapes>
            </div>
        `;
      }
}