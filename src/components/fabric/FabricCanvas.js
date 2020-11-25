import React, { useRef, useEffect } from 'react'

import { fabric } from 'fabric';

function FabricCanvas(props) {
  const { backgroundColor, children, setCanvas, size } = props
  const canvasRef = useRef(null)
  const w = window.innerWidth
  const h = window.innerHeight

  useEffect(() => {
    setCanvas(
      new fabric.Canvas(canvasRef.current, {
        renderOnAddRemove: true,
        width: size.width,
        height: size.height,
        // width: w,
        // height: h,
        backgroundColor: backgroundColor,
        preserveObjectStacking: true
      }),
    )
  }, [setCanvas])

  return (
    <>
      <canvas ref={canvasRef} />
      {children}
    </>
  );
}

export default FabricCanvas;