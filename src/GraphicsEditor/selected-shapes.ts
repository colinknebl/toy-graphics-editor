import { customElement, property, LitElement, html, css } from 'lit-element';
import type { Shape } from './Shapes/Shape';

@customElement('selected-shapes')
class SelectedShapes extends LitElement {

    @property()
    public selectedShapes!: {shapes: Shape[]}

    public static get styles() {
        return css`
            li {
                list-style-type: none;
            }
        `;
    }

    render() {        
        return html`
            ${this.selectedShapes.shapes.map(shape => html`
                <li>
                    <shape-editor .shape=${{shape}} .color=${shape.color}></shape-editor>
                </li>
            `)}
        `;
    }
}