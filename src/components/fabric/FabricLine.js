import { fabric } from "fabric";

function FabricLine(canvas, size) {
  const line = new fabric.Line([50, 100, 100, 50], {
    left: size.width / 2,
    top: size.height / 2,
    originX: 'center',
    originY: 'center',
    stroke: '#000000',
    targetFindTolerance: true
  });

  canvas.add(line)
  canvas.setActiveObject(line)
}

export default FabricLine
