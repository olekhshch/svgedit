const name = 'resize_canvas'

export default {
    name,
    async init() {
        const svgEditor = this
        const { svgCanvas } = svgEditor;
        const { $id, $click, NS } = svgCanvas;
        const canvasBg = $id('canvasBackground')
        
        return {
            name,
            callback () {
                const buttonTemplate = `<se-button id="tool_resize_canvas" title="Resize canvas" shortcut="" src="resize_canvas.svg"></se-button>`
                svgCanvas.insertChildAtIndex($id('editor_panel'), buttonTemplate, 5)

            }
        }
    }
}