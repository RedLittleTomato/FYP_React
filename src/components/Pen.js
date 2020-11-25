import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    backgroundColor: '#cfe8fc',
    height: '100vh',
    width: '100vw'
  },
  canvas: {
    backgroundColor: '#ffffff'
  }
}));

function Pen(props) {
  const classes = useStyles()
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // canvas.style.width = `${window.innerWidth / 2}px`;
    // canvas.style.height = `${window.innerHeight / 2}px`;

    // canvas.width = 300;
    // canvas.height = 300;
    // canvas.style.width = `300px`;
    // canvas.style.height = `300px`;

    const context = canvas.getContext("2d")
    context.scale(2, 2)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 5
    contextRef.current = context
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.strokeStyle = props.color
  }, [props])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    contextRef.current.stroke()
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  return (
    <div className={classes.root}>
      <canvas
        className={classes.canvas}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      ffffffffffffffffffffffffffffffffffffffffffff
      <button onClick={e => {
        e.preventDefault()
        console.log(contextRef)
      }}>To JSON</button>
    </div>
  );
}

export default Pen;