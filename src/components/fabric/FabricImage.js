import { fabric } from "fabric";

function FabricImage({ imageSrc, size, canvas }) {
  // const image = new fabric.Image(imageSrc, {
  //   left: size.width / 2,
  //   top: size.height / 2,
  //   originX: 'center',
  //   originY: 'center',
  //   opacity: 1 // default
  // });

  fabric.Image.fromURL(imageSrc, function (oImg) {
    oImg.scale(0.1);
    canvas.add(oImg);
    canvas.setActiveObject(oImg)
  });
}

export default FabricImage
