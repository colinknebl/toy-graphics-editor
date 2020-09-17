import { customElement, property, LitElement, html } from 'lit-element';
import type { Shape } from './Shapes/Shape';

@customElement('selected-shapes')
class SelectedShapes extends LitElement {

    @property()
    public selectedShapes!: {shapes: Shape[]}

    render() {        
        return html`
            ${this.selectedShapes.shapes.map(shape => html`
                <li>
                    <shape-editor .shape=${{shape}} .color=${shape.color}></shape-editor>
                </li>
            `)}
        `
    }
}