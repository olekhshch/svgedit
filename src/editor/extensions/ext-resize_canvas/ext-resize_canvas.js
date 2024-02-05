const name = 'resize_canvas'

export default {
    name,
    async init() {
        const svgEditor = this
        const { svgCanvas } = svgEditor;
        const { $id, $click, assignAttributes, svgContent, zoom } = svgCanvas;
        const svgdoc = $id('svgcanvas');
        const canvasBg = $id('canvasBackground');

        const resizeBox = document.createElement('div')
        resizeBox.style.display = 'none'
        resizeBox.style.top = svgContent.getAttribute('y') + 'px'
        resizeBox.style.left = svgContent.getAttribute('x') + 'px'
        resizeBox.style.position = 'absolute'
        resizeBox.style.border = '1px solid blue'

        svgdoc.appendChild(resizeBox)

        const drawResizeBox = (dX = 0, dY = 0) => {
            // const width = canvasBg.getAttribute('width')
            // const height = canvasBg.getAttribute('height')
            resizeBox.style.top = canvasBg.getAttribute('y') + 'px'
            resizeBox.style.left = canvasBg.getAttribute('x') + 'px'
            resizeBox.style.width = canvasBg.getAttribute('width') + 'px'
            resizeBox.style.height = canvasBg.getAttribute('height') + 'px'

        }

        const showResizeBox = () => {
            drawResizeBox()
            resizeBox.style.display ='block'
        }

        const hideResizeBox = () => {
            resizeBox.style.display = 'none'
        }
        
        return {
            name,
            canvasUpdated () {
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