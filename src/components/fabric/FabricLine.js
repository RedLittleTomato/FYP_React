import { fabric } from "fabric";

function FabricLine(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight

  const line = new fabric.Line([50, 100, 100, 50], {
    left: w / 2,
    top: h / 2,
    originX: 'center',
    originY: 'center',
    stroke: '#000000',
    targetFindTolerance: true
  });

  canvas.add(line)
  canvas.setActiveObject(line)
}

export default FabricLine
