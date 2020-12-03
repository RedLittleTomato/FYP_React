import { fabric } from "fabric";

function FabricTextbox(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight

  const textbox = new fabric.Textbox('text', {
    left: w / 2,
    top: h / 2,
    originX: 'center',
    originY: 'center'
  });

  canvas.add(textbox)
  canvas.setActiveObject(textbox)
}

export default FabricTextbox
