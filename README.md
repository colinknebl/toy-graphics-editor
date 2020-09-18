# Toy Graphics Editor

HTML `canvas` graphics editor.

Allows the user to place circles and rectanlges, adjust their 
dimensions and colors, and drag them around the canvas.

# Architecture

- Lit Element library for rendering the UI
    - graphics-editor is the root element
    - selected-shapes renders the list of selected shape attributes / inputs
    - shape-editor renders the individual shape attributes / inputs
- Canvas object (Singleton)
    - path: (src/GraphicsEditor/Canvas/Canvas.ts)
    - primary purpose: 
        - set up canvas element listeners
        - some static methods for working with the canvas element
- Shape object (abstract class)
    - path: (src/GraphicsEditor/Shapes/Shape.ts)
    - primary purpose: 
        - base class for all shapes
        - stores data about the shape (e.g. x, y coordinates, height, width, etc.)
        - the logic in the class is for managing the state of the shape, and 
          triggering a re-draw of the canvas element when required
- Circle object (inherits from Shape)
    - path: (src/GraphicsEditor/Circle/Circle.ts)
    - primary purpose: 
        - stores data specific to circles (e.g. radius)
        - implements required abstract methods for working with a circle
- Rectangle object (inherits from Shape)
    - path: (src/GraphicsEditor/Rectangle/Rectangle.ts)
    - primary purpose: 
        - implements required abstract methods for working with a rectangle

# Requirements for the following features

### localStorage based persistence

- Create a local storage facade
- Add function calls to persist data 

### undo/redo

- Create a Stack
- As users edit the canvas, add their actions to the stack
- When the user clicks undo, pop the last action off the stack and re-render the canvas
- When the user clicks redo, re-add the popped action to the stack and re-render the canvas

### save to image

- get the base64
- then create an `img` element where the img `src` attribute is the base64