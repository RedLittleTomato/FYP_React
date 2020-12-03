import { fabric } from "fabric";

function FabricTriangle(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight

  const triangle = new fabric.Triangle({
    left: w / 2,
    top: h / 2,
    originX: 'center',
    originY: 'center',
    fill: 'rgb(244, 67, 54)',
    width: 50,
    height: 50,
    stroke: "black",
    strokeWidth: 1,
  });
  canvas.add(triangle)
  canvas.setActiveObject(triangle)
}

export default FabricTriangle
