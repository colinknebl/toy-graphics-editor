import { customElement, property, LitElement, html, css } from 'lit-element';
import { Canvas } from './Canvas/Canvas';
import { ShapeType } from './Shapes/Shape';

@customElement('graphics-editor')
export class CanvasElement extends LitElement {

    private _canvas?: Canvas;
    get canvas(): Canvas | undefined {
        return this._canvas;
    }

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
        `;
    }

    public connectedCallback() {
        super.connectedCallback();
    }

    public firstUpdated() {
        this._canvas = new Canvas(this.shadowRoot?.querySelector('canvas') as HTMLCanvasElement);
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
                <shape-editor .shape="${{foo: 'bar'}}"></shape-editor>
            </div>
        `;
      }
}

@customElement('shape-editor')
class ShapeEditor extends LitElement {
    @property()
    public shape?: {foo: string};

    public static get styles() {
        return css`
            .shape-editor {
                color: #333;
                font-size: 1rem;
                font-family: monospace;

                width: 300px;
                display: grid;
                grid-template-areas:
                    "delete-button shape-type"
                    "shape-attributes shape-attributes"
                ;
            }

            .delete-button {
                grid-area: delete-button;
            }

            .shape-type {
                text-align: center;
                margin: 0;
                padding: 5px;
                grid-area: shape-type;
            }

            .shape-attributes {
                grid-area: shape-attributes;
            }
        `;
    }

    public render() {
        return html`
            <div class="shape-editor">
                <button class="delete-button">Delete</button>
                <p class="shape-type">ShapeType<p>
                <div class="shape-attributes">
                    attributes...
                </div>
            </div>
        `;
      }
}