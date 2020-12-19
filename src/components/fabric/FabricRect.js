import { fabric } from "fabric";

function FabricRect(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight

  const rect = new fabric.Rect({
    left: w / 2,
    top: h / 2,
    originX: 'center',
    originY: 'center',
    fill: 'rgb(244, 67, 54)',
    width: 50,
    height: 50,
    stroke: "black", // stroke = border
    strokeWidth: 1,
  });
  canvas.add(rect)
  canvas.setActiveObject(rect)
}

export default FabricRect
