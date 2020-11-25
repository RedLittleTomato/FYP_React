import React, { useEffect, useRef, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useLocation } from 'react-router-dom';
import { fabric } from "fabric";
import { ChromePicker } from 'react-color'
import 'fabric-history';
import { flyerAPIs } from '../api'

import QRGenerator from '../components/QRGenerator'
import { Canvas, Circle, Image, Line, Rect, Textbox } from '../components/fabric'

import {
  BlockDialog,
  Drawer,
  LoadingScreen
} from '../components'

import {
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'; // Square
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'; // Circle
import ChevronRightIcon from '@material-ui/icons/ChevronRight'; // Arrow Right
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'; // Arrow Down
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import SendIcon from '@material-ui/icons/Send';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp'; // Line
import CreateIcon from '@material-ui/icons/Create'; // Pen

const useStyles = makeStyles(() => ({
  chromePicker: {
    boxShadow: 'none !important',
  },
  bold: {
    fontWeight: 'bold !important'
  }
}));

function Flyer() {
  const classes = useStyles();
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(useLocation().data)
  const query = new URLSearchParams(useLocation().search)
  const [canvas, setCanvas] = useState()
  const [project, setProject] = useState('')
  const [saved, setSaved] = useState(false)
  const [savedLoading, setSavedLoading] = useState(false)
  const [dialog, setDialog] = useState(!fullScreen)
  const [holdCtrl, setHoldCtrl] = useState(false)
  const [clipboard, setClipboard] = useState()
  const [expend, setExpend] = useState(true)
  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);
  const [imageUrl, setImageUrl] = useState('')
  const [drawing, setDrawing] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [openQR, setOpenQR] = useState(false)
  const [error, setError] = useState({
    state: 'false',
    message: ''
  })
  const [grab, setGrab] = useState(false)

  // 1 centimeter = (96 / 2.54) px
  const cm = 96 / 2.54
  const [paperSize, setPaperSize] = useState({
    'A3': { width: `297${cm}`, height: `420${cm}` },
    'A4': { width: `210${cm}`, height: `297${cm}` },
    'A5': { width: `148${cm}`, height: `210${cm}` },
  })
  const [color, setColor] = useState("#000000")

  const undo = () => {
    if (canvas.historyUndo.length !== 1) {
      canvas.undo()
    }
  }

  const redo = () => {
    if (canvas.historyRedo.length !== 0) {
      canvas.redo()
    }
  }

  const deleteCanvasObject = () => {
    if (canvas.getActiveObject()) {
      canvas.remove(canvas.getActiveObject())
    }
    if (canvas.getActiveObjects()) {
      canvas.remove(...canvas.getActiveObjects())
    }
  }

  useEffect(() => {
    async function getFlyerDetails() {
      if (data && data.canvas !== '') {
        setProject(data.canvas)
        return
      }
      setLoading(true)
      const id = query.get("id")
      await flyerAPIs.getFlyer(id)
        .then(res => {
          const data = res.data
          setProject(data.data.canvas)
        })
        .catch(err => {
          const res = err
          console.log(res)
        })
      setLoading(false)
    }
    getFlyerDetails()
  }, [])

  useEffect(() => {
    if (project) {
      canvas.loadFromJSON(project)
      canvas.setWidth(project.width)
      canvas.setHeight(project.height)
      setProject('')
    }
  }, [project, canvas])


  useEffect(() => {
    function downHandler({ key }) {
      if (key === "Delete" && canvas.defaultCursor !== "text") {
        deleteCanvasObject()
      }
      if (!holdCtrl && key === "Control") {
        setHoldCtrl(true)
      }
      if (holdCtrl && key === "x" && canvas.getActiveObject()) {
        setClipboard(canvas.getActiveObject())
        canvas.remove(canvas.getActiveObject());
        console.log("cut")
      }
      if (holdCtrl && key === "c" && canvas.getActiveObject()) {
        setClipboard(canvas.getActiveObject())
        console.log("copied")
      }
      if (holdCtrl && key === "v" && clipboard) {
        clipboard.clone((cloneObject) => {
          cloneObject.set("top", cloneObject.top + 5);
          cloneObject.set("left", cloneObject.left + 5);
          setClipboard(cloneObject)
          canvas.add(cloneObject)
        })
        console.log("pasted")
      }
      if (holdCtrl && key === "z") undo()
      if (holdCtrl && key === "y") redo()
      canvas.renderAll()
    }
    function upHandler({ key }) {
      if (key === "Control") {
        setHoldCtrl(false)
      }
    }
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [canvas, clipboard, holdCtrl, setClipboard, setHoldCtrl]);

  const pen = () => {
    setDrawing(!drawing)
    // canvas.freeDrawingBrush = new fabric.CircleBrush()
    canvas.freeDrawingBrush.color = "#000000"
    canvas.freeDrawingBrush.width = "10"
    canvas.isDrawingMode = !drawing;
  }
  const handleGrab = event => {
    setGrab(event.target.checked)
    if (!grab) {
      canvas.set('selection', false)
    } else {
      canvas.setCursor('default')
      canvas.set('selection', true)
      canvas.off("mouse:move")
      canvas.renderAll()
    }
  }

  let mousePressed = false
  // listener
  useEffect(() => {
    if (!canvas) return
    canvas.on('mouse:move', (event) => {
      if (grab) {
        canvas.setCursor('grab')
        canvas.renderAll()
      }
      if (grab && mousePressed) {
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
        canvas.relativePan(delta)
      }
    })
    canvas.on('mouse:down', function (options) {
      mousePressed = true
      if (!drawing && options.target) {
        setColor(options.target.fill === null ? options.target.stroke : options.target.fill)
        setOpacity(options.target.opacity)
        // console.log(canvas)
      }
    })
    canvas.on('mouse:up', function (options) {
      mousePressed = false
    })
    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      console.log(zoom)
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })
  }, [canvas, drawing, grab, mousePressed])

  const addSquare = (e) => {
    e.preventDefault()
    Rect(canvas, paperSize.A4)
  }

  const addCircle = (e) => {
    e.preventDefault()
    Circle(canvas, paperSize.A4)
  }

  const addLine = (e) => {
    e.preventDefault()
    Line(canvas, paperSize.A4)
  }

  const addImage = async (e, src) => {
    e.preventDefault()
    if (src === 'file' && !e.target.files[0]) return
    if (src === 'url') {
      if (imageUrl === '') {
        setError({
          state: true,
          message: 'Please provide link'
        })
        return
      }
      if ((imageUrl.match(/\.(jpeg|jpg|gif|png|cms|svg)$/) === null) && !imageUrl.includes('data:image/')) {
        setError({
          state: true,
          message: 'The link is not an image'
        })
        return
      }
    }
    if (src === 'file') {
      // URL.createObjectURL(e.target.files[0]) ==> temporary link for image 
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0])
      reader.addEventListener("load", () => {
        var image = reader.result;
        Image({ imageSrc: image, size: paperSize.A4, canvas: canvas })
      });
    } else {
      Image({ imageSrc: imageUrl, size: paperSize.A4, canvas: canvas })
      setImageUrl('')
    }
  }

  const addTextbox = (e) => {
    e.preventDefault()
    Textbox(canvas, paperSize.A4)
  }

  const download = (e) => {
    const imageUrl = canvas
      .toDataURL(`image/jpg`)
      .replace(`image/jpg}`, "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `flyer.jpg`;
    downloadLink.click();
  }

  const expendShape = (e) => {
    e.preventDefault()
    setExpend(!expend)
  }

  const showQR = () => {
    setOpenQR(true)
  }

  const closeQR = () => {
    setOpenQR(false)
  }

  const save = async () => {
    if (saved) return
    const canvasJSON = canvas.toJSON()
    canvasJSON.width = canvas.width
    canvasJSON.height = canvas.height
    const imageData = canvas
      .toDataURL(`image/jpg`)
      .replace(`image/jpg}`, "image/octet-stream")
    console.log(typeof imageData)
    const payload = {
      id: query.get("id"),
      editor: localStorage.getItem('user_id'),
      canvas: canvasJSON,
      image: imageData
    }
    setSavedLoading(true)
    await flyerAPIs.saveFlyerChanges(payload)
      .then(res => {
        const data = res.data
        console.log(data.message)
      })
      .catch(err => {
        const response = err.response
        console.log(response)
      })
    setSavedLoading(false)
    setSaved(true)
  }

  const group = (e) => {
    e.preventDefault()
    if (canvas.getActiveObjects()) {
      var objects = canvas.getActiveObjects()
      var groupObject = new fabric.Group(objects)
      groupObject.set("top", canvas._activeObject.top);
      groupObject.set("left", canvas._activeObject.left);
      deleteCanvasObject()
      canvas.add(groupObject)
      canvas.renderAll()
    }
  }

  const ungroup = (e) => {
    e.preventDefault()
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().destroy() // to clear the origin position
      var objects = canvas.getActiveObject()._objects
      objects.forEach(object => {
        canvas.add(object)
      })
      deleteCanvasObject()
      canvas.renderAll()
    }
  }

  const bringForward = () => {
    canvas.bringForward(canvas.getActiveObject())
  }
  const bringToFront = () => {
    canvas.bringToFront(canvas.getActiveObject())
  }
  const sendBackwards = () => {
    canvas.sendBackwards(canvas.getActiveObject())
  }
  const sendToBack = () => {
    canvas.sendToBack(canvas.getActiveObject())
  }

  const setColorListener = (value) => {
    setColor(value)
    canvas.getActiveObject().fill === null ? canvas.getActiveObject().set("stroke", value) : canvas.getActiveObject().set("fill", value)
    canvas.renderAll()
  }

  const setOpacityListener = (value) => {
    setOpacity(value)
    canvas.getActiveObject().set("opacity", value)
    canvas.renderAll()
  }

  // test = { "version": "4.2.0", "objects": [{ "type": "rect", "version": "4.2.0", "originX": "center", "originY": "center", "left": 105, "top": 148.5, "width": 40, "height": 40, "fill": "rgb(244, 67, 54)", "stroke": "black", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0, "rx": 0, "ry": 0 }], "background": "white", "width": "210", "height": "297" }

  return (
    <div>
      <LoadingScreen open={loading} />
      {fullScreen && <BlockDialog dialog={fullScreen} setDialog={setDialog} />}
      <>
        <QRGenerator fullScreen={dialog} open={openQR} onClose={closeQR} flyerName="flyer" type="pdf" url="https://www.google.com/" />
        <Drawer anchor="left">
          <div>
            <Button onClick={e => {
              e.preventDefault()
              const canvasJSON = canvas.toJSON()
              canvasJSON.width = canvas.width
              canvasJSON.height = canvas.height
              console.log(canvas)
              console.log(canvasJSON)
              console.log(JSON.stringify(canvasJSON))
            }}>To JSON</Button>
            <Button onClick={e => download(e)}>Download</Button>
          </div>
          <div>
            <Button onClick={e => save(e)}>Save</Button>
            <Button onClick={e => showQR(e)}>QR code</Button>
          </div>
          <div>
            <Button onClick={e => undo(e)}>Undo</Button>
            <Button onClick={e => redo(e)}>Redo</Button>
          </div>
          <div>
            <Button onClick={e => group(e)}>Group</Button>
            <Button onClick={e => ungroup(e)}>Ungroup</Button>
          </div>
          <div>
            <Button onClick={e => bringForward(e)}>Bring Forward</Button>
            <Button onClick={e => bringToFront(e)}>Bring To Front</Button>
          </div>
          <div>
            <Button onClick={e => sendBackwards(e)}>Send Backward</Button>
            <Button onClick={e => sendToBack(e)}>Send To Back</Button>
          </div>
          <div>
            <Button onClick={e => handleGrab(e)}>Grab</Button>
            <Switch
              checked={grab}
              onChange={handleGrab}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
          <List>
            <Tooltip arrow disableFocusListener title="Shortcut => (Ctrl + Z)" placement="right">
              <ListItem button key={'undo'} onClick={e => undo(e)}>
                <ListItemIcon><CheckBoxOutlineBlankIcon /></ListItemIcon>
                <ListItemText primary={"Undo"} />
              </ListItem>
            </Tooltip>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Shape</p>
            <ListItem button key={0} onClick={e => expendShape(e)}>
              <ListItemIcon>{expend ? <ExpandMoreIcon /> : <ChevronRightIcon />}</ListItemIcon>
              {/* <p style={{ fontWeight: "bold" }}>Shape</p> */}
              <ListItemText className={classes.bold}>Shape</ListItemText>
              <ListItemIcon>{expend ? <ExpandMoreIcon /> : <ChevronRightIcon />}</ListItemIcon>
            </ListItem>
            <Divider />
            <Collapse in={expend}>
              <ListItem button key={1} onClick={e => addSquare(e)}>
                <ListItemIcon><CheckBoxOutlineBlankIcon /></ListItemIcon>
                <ListItemText primary={"Square"} />
              </ListItem>
              <ListItem button key={2} onClick={e => addCircle(e)}>
                <ListItemIcon><RadioButtonUncheckedIcon /></ListItemIcon>
                <ListItemText primary={"Circle"} />
              </ListItem>
              <ListItem button key={7} onClick={e => addLine(e)}>
                <ListItemIcon><RemoveSharpIcon /></ListItemIcon>
                <ListItemText primary={"Line"} />
              </ListItem>
            </Collapse>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Image</p>
            <Divider />
            <ListItem button key={3} onClick={e => hiddenFileInput.current.click()}>
              <ListItemIcon><ImageIcon /></ListItemIcon>
              <ListItemText primary={"Upload Image"} />
            </ListItem>
            <input type="file" ref={hiddenFileInput} style={{ display: 'none' }} onChange={e => addImage(e, 'file')} />
            <ListItem button key={4} onClick={e => expendShape(e)}>
              <ListItemIcon><LinkIcon /></ListItemIcon>
              <ListItemText primary={"Image URL"} />
            </ListItem>
            <Collapse in={expend}>
              <ListItem key={5} >
                <TextField
                  size="small"
                  label="Image URL"
                  value={imageUrl}
                  onChange={event => setImageUrl(event.target.value)}
                />
                <IconButton size="small" onClick={e => addImage(e, 'url')}><SendIcon fontSize="small" /></IconButton>
              </ListItem>
            </Collapse>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Text</p>
            <Divider />
            <ListItem button key={6} onClick={e => addTextbox(e)}>
              <ListItemIcon><TextFieldsIcon /></ListItemIcon>
              <ListItemText primary={"Text"} />
            </ListItem>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Drawing</p>
            <Divider />
            <ListItem button key={7} onClick={e => pen(e)}>
              <ListItemIcon><CreateIcon /></ListItemIcon>
              <ListItemText primary={"Pen"} />
            </ListItem>
          </List>
        </Drawer>
        <Drawer anchor="right">
          <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Color</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ChromePicker
              className={classes.chromePicker}
              color={color}
              onChange={color => setColorListener(color.hex)}
              disableAlpha={true}
            // renderers={{ canvas: Canvas }}
            />
          </div>
          <div style={{ padding: '16px' }}>
            {/* <Typography id="disabled-slider" gutterBottom>
              Opacity
            </Typography> */}
            <p style={{ fontWeight: "bold" }}>Opacity</p>
            <Slider
              defaultValue={1}
              value={opacity}
              // onChange={(e, value) => setOpacityListener(value)}
              onChangeCommitted={(e, value) => setOpacityListener(value)}
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0}
              max={1}
            />
          </div>

          {/* <Divider />
          <CirclePicker
            width={250}         // 252
            circleSize={25}     // 28
            circleSpacing={10}  // 14
            color={color}
            onChange={color => applyColor(color.hex)}
          /> */}
        </Drawer>
        {/* {!dialog && <Pen color={color} />} */}
        {/* {!dialog &&
          <>
            <DesignCanvas canvas={canvas} setCanvas={setCanvas}>
              {Object.entries(texts).map(
                ([key, options]) =>
                  canvas && <Text id={key} options={options} canvas={canvas} onChange={onTextChange} key={key} />,
              )}
              {Object.entries(texts).map(
                ([key, options]) =>
                  canvas && <Text options={options} canvas={canvas} id={key} key={key} onChange={onTextChange} />,
              )}
              <Circle canvas={canvas} radius={20} top={200} />
            </DesignCanvas>
          </>
        } */}
        <div style={{ backgroundColor: '#cfe8fc', height: '100vh', width: "100vw" }}>
          <Container style={{ backgroundColor: '#cfe8fc', display: "flex", alignItems: "center", justifyContent: "center", height: '100vh' }} >
            <Canvas
              id="canvas"
              backgroundColor="white"
              setCanvas={setCanvas}
              size={paperSize.A4}
            >
              {/* {Object.entries(texts).map(
                ([key, options]) =>
                  canvas && <Text id={key} options={options} canvas={canvas} onChange={onTextChange} key={key} />,
              )} */}
            </Canvas>
          </Container>
        </div>
      </>
      {/* } */}
    </div >
  )
}

export default Flyer
