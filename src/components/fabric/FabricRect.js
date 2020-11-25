import { fabric } from "fabric";

function FabricRect(canvas, size) {
  const rect = new fabric.Rect({
    left: size.width / 2,
    top: size.height / 2,
    originX: 'center',
    originY: 'center',
    fill: 'rgb(244, 67, 54)',
    width: 40,
    height: 40,
    stroke: "black", // stroke = border
    strokeWidth: 1,
    // cornerColor: 'blue',
    // cornerStyle: 'circle',
  });
  canvas.add(rect)
  canvas.setActiveObject(rect)
}

export default FabricRect
