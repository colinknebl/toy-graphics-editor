import { customElement, property, LitElement, html, css, TemplateResult} from 'lit-element';
import { Canvas } from './Canvas/Canvas';
import { Circle } from './Shapes/Circle/Circle';
import { Rectangle } from './Shapes/Rectangle/Rectangle';
import type { Shape } from './Shapes/Shape';

@customElement('shape-editor')
class ShapeEditor extends LitElement {
    @property()
    public shape?: { shape: Shape };

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

    private _updateColor() {
        if (!this.shape) return;
        const {shape} = this.shape;
        const color = (this.shadowRoot?.querySelector('input#color-picker') as HTMLInputElement).value
        shape.color = color;
    }

    private _getDimensionsEditors(): TemplateResult | void {
        if (!this.shape) return;
        const { shape } = this.shape;
        if (shape instanceof Rectangle) {
            return html`
                <label for="height">height</label>
                <input id="height" type="range" value=${shape.height} min="10" max="400" @input=${(e: Event) => this._updateHeight(Number((e.target as HTMLInputElement)?.value))} />
                <label>width</label>
                <input id="width" type="range" value=${shape.width} min="10" max="400" @input=${(e: Event) => this._updateWidth(Number((e.target as HTMLInputElement)?.value))} />
            `;
        } else if (shape instanceof Circle) {
            return html`
                <label for="radius">radius</label>
                <input id="radius" type="range" value=${shape.radius} min="10" max="200" @input=${(e: Event) => this._updateRadius(Number((e.target as HTMLInputElement)?.value))} />
            `
        } else {
            console.warn('shape not supported');
        }
    }

    public updated() {
        // for some reason the value of the color input isn't working as expected; 
        // this updates the color picker display color to the correct color
        (this.shadowRoot?.querySelector('input[type="color"]') as HTMLInputElement).value = String(this.shape?.shape.color);
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
                <input id="color-picker" type="color" value="${shape.color}" @input=${() => this._updateColor()} />
            </div>
        `;
      }
}