const name = 'resize_canvas'

export default {
    name,
    async init() {
        const svgEditor = this
        const { svgCanvas } = svgEditor;
        const { $id, $click, assignAttributes, svgContent } = svgCanvas;
        const svgdoc = $id('svgcanvas');
        const canvasBg = $id('canvasBackground');

        let dX = 0;
        let dY = 0;
        let width = Number(canvasBg.getAttribute('width')) ?? 0;
        let height = Number(canvasBg.getAttribute('height')) ?? 0;

        const resizeBox = document.createElement('div')
        resizeBox.style.display = 'none'
        resizeBox.style.top = svgContent.getAttribute('y') + 'px'
        resizeBox.style.left = svgContent.getAttribute('x') + 'px'
        resizeBox.style.position = 'absolute'
        resizeBox.style.border = '1px solid blue'

        const rightHandle = document.createElement('div');
        rightHandle.style.width = '4px';
        rightHandle.style.background = 'blue';
        rightHandle.style.position = 'absolute';
        rightHandle.style.right = '0'
        rightHandle.style.top = Math.min(22, 0.1 * height) + 'px'
        rightHandle.style.bottom = Math.min(22, 0.1 * height) + 'px'
        rightHandle.style.cursor = 'e-resize';
        resizeBox.appendChild(rightHandle);


        svgdoc.appendChild(resizeBox)

        const drawResizeBox = () => {
          const zoom = svgCanvas.getZoom()
            resizeBox.style.top = canvasBg.getAttribute('y') + 'px'
            resizeBox.style.left = canvasBg.getAttribute('x') + 'px'
            resizeBox.style.width = width + dX * zoom + 'px'
            resizeBox.style.height = height + dY * zoom + 'px'
        }

        const showResizeBox = () => {
            drawResizeBox()
            resizeBox.style.display ='block'
        }

        const hideResizeBox = () => {
            resizeBox.style.display = 'none'
        }

        /**
         * Mousedown handler to set new resize box dimensions
         * @param {Event} e Mouse Event
         * @param {string} side "top" | "bottom" | "right" | 'left
         */
        const handleResize = (e, side) => {
          const x0 = e.clientX;
          const y0 = e.clientY;
          let x = e.clientX;
          const dX0 = dX
          const zoom = svgCanvas.getZoom()

          const mousemoveHandler = (ev) => {
            if (side === 'right') {
              x = ev.clientX
              dX = dX0 + (x - x0) / zoom
              drawResizeBox()
            }
          }

          window.addEventListener('mousemove', mousemoveHandler)
          window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', mousemoveHandler)
          })
        }

        rightHandle.addEventListener('mousedown', (e) => handleResize(e, 'right'))
        
        return {
            name,
            canvasUpdated () {
                width = Number(canvasBg.getAttribute('width')) ?? 0;
                height = Number(canvasBg.getAttribute('height')) ?? 0;
                drawResizeBox()
            },
            callback () {
                const buttonTemplate = `<se-button id="${name}" title="Resize canvas" shortcut="" src="resize_canvas.svg"></se-button>`
                svgCanvas.insertChildAtIndex($id('editor_panel'), buttonTemplate, 5)

                const button = $id(name);

                // Click handler for the button
                $click( button, (e) => {
                    const currentMode = svgCanvas.getMode()

                    if (currentMode === name) {
                        button.removeAttribute('pressed')
                        button.setAttribute('title', 'Resize canvas')
                        svgCanvas.setMode('select')
                        return
                    }

                    button.setAttribute('pressed', true)
                    button.setAttribute('title', 'Cancel resize canvas mode')
                    svgCanvas.setMode(name)
                })

                // Shows/hides resize box on mode change
                document.addEventListener('modeChange', (e) => {
                  //#TODO: "Pressed" attribute change if mode was changed not by click
                    const mode = svgCanvas.getMode()

                    if (mode === name) {
                        showResizeBox()
                        return
                    }

                    hideResizeBox()
                })
            }
        }
    }
}