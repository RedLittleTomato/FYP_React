import React, { useRef, useEffect } from 'react'
// import PropTypes from 'prop-types'

import { fabric } from 'fabric';

// const fabric = window.fabric

// class DesignCanvas extends React.Component {
//   // static propTypes = {
//   //   width: PropTypes.number.isRequired,
//   //   height: PropTypes.number.isRequired,
//   // }

//   static defaultProps = {
//     width: 600,
//     height: 400,
//   }

//   state = {
//     canvas: null,
//   }

//   componentDidMount() {
//     const canvas = new fabric.Canvas(this.c)
//     this.setState({ canvas })
//   }

//   render() {
//     const children = React.Children.map(this.props.children, child => {
//       return React.cloneElement(child, {
//         canvas: this.state.canvas,
//       })
//     })
//     const { width, height } = this.props
//     return (
//       <Fragment>
//         <canvas ref={c => (this.c = c)} width={width} height={height} />
//         {this.state.canvas && children}
//         <button onClick={e => {
//           e.preventDefault()
//           console.log(this.state.canvas.toJSON())
//         }}>To JSON</button>
//       </Fragment>
//     )
//   }
// }

function DesignCanvas({
  canvas,
  setCanvas,
  children,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    setCanvas(
      new fabric.Canvas(canvasRef.current, {
        renderOnAddRemove: true,
        width: window.innerWidth,
        height: window.innerHeight - 200
      }),
    );
    // canvas = canvasRef.current;
    // canvas.width = window.innerWidth * 2;
    // canvas.height = window.innerHeight * 2;
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
  }, [setCanvas])

  return (
    <>
      <canvas ref={canvasRef} />
      {children}
      <button onClick={e => {
        e.preventDefault()
        console.log(canvas.toJSON())
      }}>To JSON</button>
    </>
  );
}

export default DesignCanvas;