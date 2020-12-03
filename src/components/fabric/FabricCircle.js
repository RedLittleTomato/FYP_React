import { fabric } from "fabric";

// const propTypes = {
//   canvas: PropTypes.object,
//   top: PropTypes.number.isRequired,
//   left: PropTypes.number.isRequired,
//   radius: PropTypes.number.isRequired,
//   fill: PropTypes.string.isRequired,
// }

// const defaultProps = {
//   top: 0,
//   left: 0,
//   radius: 5,
//   fill: 'red',
// }

function FabricCircle(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight

  const circle = new fabric.Circle({
    left: w / 2,
    top: h / 2,
    originX: 'center',
    originY: 'center',
    radius: 20,
    fill: 'red',
    stroke: "black", // stroke = border
    strokeWidth: 1,
  });

  canvas.add(circle)
  canvas.setActiveObject(circle)
}

export default FabricCircle