import { fabric } from "fabric";

function FabricImage(props) {
  const { imageSrc, canvas } = props
  const w = window.innerWidth
  const h = window.innerHeight
  // const image = new fabric.Image(imageSrc, {
  //   left: size.width / 2,
  //   top: size.height / 2,
  //   originX: 'center',
  //   originY: 'center',
  //   opacity: 1 // default
  // });

  fabric.Image.fromURL(imageSrc, function (oImg) {
    // oImg.scale(0.1)
    oImg.set({
      left: w / 2,
      top: h / 2,
      originX: 'center',
      originY: 'center',
    });
    canvas.add(oImg)
    canvas.setActiveObject(oImg)
  });
}

export default FabricImage
