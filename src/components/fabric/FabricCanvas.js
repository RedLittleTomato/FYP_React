import React, { useRef, useEffect } from 'react'

import { fabric } from 'fabric';

function FabricCanvas(props) {
  const { id, setCanvas } = props
  const canvasRef = useRef(null)

  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    setCanvas(new fabric.Canvas(canvasRef.current, {
      renderOnAddRemove: true,
      preserveObjectStacking: true,
      width: w,
      height: h,
      backgroundColor: '#f5f5f6',
    }))
  }, [setCanvas])

  return (
    <>
      <canvas id={id} ref={canvasRef} />
    </>
  );
}

export default FabricCanvas;