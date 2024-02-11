import resizeBoxHTML from './resizeBox.html'
import resizeDialogHTML from './resizeDialog.html'

const name = 'resize_canvas'

export default {
    name,
    async init() {
        const svgEditor = this
        const { svgCanvas } = svgEditor;
        const { $id, $click, svgContent, setResolution } = svgCanvas;
        const svgContainer = $id('svgcanvas');
        const canvasBg = $id('canvasBackground');
        const workarea = $id('workarea');

        const templateBox = document.createElement('template')
        templateBox.innerHTML = resizeBoxHTML
        const templateDialog = document.createElement('template')
        templateDialog.innerHTML = resizeDialogHTML

        let dX = 0;
        let dY = 0;
        let width = Number(canvasBg.getAttribute('width')) ?? 0;
        let height = Number(canvasBg.getAttribute('height')) ?? 0;

        //inserting shadow root with the resize box and it's handles into svgcanvas
        const boxContainer = document.createElement('div');
        const _shadowRootBox = boxContainer.attachShadow({ mode: 'open' })
        _shadowRootBox.append(templateBox.content);
        svgContainer.appendChild(boxContainer)
        const resizeBox = _shadowRootBox.getElementById('resize-box');
        resizeBox.style.display = 'none'
        resizeBox.style.top = svgContent.getAttribute('y') + 'px'
        resizeBox.style.left = svgContent.getAttribute('x') + 'px'
        const rightHandle = _shadowRootBox.getElementById('right-handle')

        //inserting dialog into workarea
        const dialogContainer = document.createElement('div')
        const _shadowRootDialog = dialogContainer.attachShadow({ mode: 'open'})
        _shadowRootDialog.append(templateDialog.content)
        const dialog = _shadowRootDialog.getElementById('resize-dialog')
        const okBtn = _shadowRootDialog.getElementById('ok-btn')
        const applyBtn = _shadowRootDialog.getElementById('apply-btn')
        const closeBtn = _shadowRootDialog.getElementById('close-btn')
        dialog.style.display = 'none'
        workarea.append(dialogContainer)

        const drawResizeBox = () => {
          const zoom = svgCanvas.getZoom()
            resizeBox.style.top = canvasBg.getAttribute('y') + 'px'
            resizeBox.style.left = canvasBg.getAttribute('x') + 'px'
            resizeBox.style.width = width + dX * zoom + 'px'
            resizeBox.style.height = height + dY * zoom + 'px'
        }

        const showDialog = () => {
          dialog.style.display = 'flex'
        }

        const hideDialog = () => {
          dialog.style.display = 'none'
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

        const confirmChanges = () => {
          const {w, h} = svgCanvas.getResolution();
          const newW = w + dX
          const newY = h + dY
          setResolution(newW, newY)
        }
        
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
                        svgCanvas.setMode('select')
                        return
                    }

                    svgCanvas.setMode(name)
                })

                // Shows/hides resize box on mode change
                document.addEventListener('modeChange', (e) => {
                    const mode = svgCanvas.getMode()

                    if (mode === name) {
                        button.setAttribute('pressed', true)
                        button.setAttribute('title', 'Cancel resize canvas mode')
                        showResizeBox()
                        showDialog()
                        return
                    }

                    button.removeAttribute('pressed')
                    button.setAttribute('title', 'Resize canvas')
                    hideDialog()
                    hideResizeBox()
                })

                document.addEventListener('keydown', e => {
                  if (svgCanvas.getMode() !== name) return

                  if (e.key === 'Enter') {
                    confirmChanges()
                    svgCanvas.setMode('select')
                    dX = 0
                    dY = 0
                  }
                })

                closeBtn.addEventListener('click', () => svgCanvas.setMode('select'))
            }
        }
    }
}