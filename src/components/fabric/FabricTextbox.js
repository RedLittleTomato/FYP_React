import { fabric } from "fabric";

function FabricTextbox(canvas, size) {
  const textbox = new fabric.Textbox('text', {
    left: size.width / 2,
    top: size.height / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Comic Sans'
  });

  canvas.add(textbox)
  canvas.setActiveObject(textbox)
}

export default FabricTextbox
