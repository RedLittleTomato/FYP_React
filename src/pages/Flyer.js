import React, { useEffect, useRef, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Prompt, useHistory, useLocation } from 'react-router-dom';
import { fabric } from "fabric";
import { ChromePicker } from 'react-color'
import 'fabric-history';
import { flyerAPIs } from '../api'

import { DownloadFlyer, EditFlyerDetailsDialog, QRGenerator } from '../components/dialogs'
import { Snackbar } from '../components/common'
import { Canvas, Circle, Image, Line, Rect, Textbox, Triangle } from '../components/fabric'

import {
  BlockDialog,
  Drawer,
  LoadingScreen
} from '../components'

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  TextField,
  Tooltip,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'; // Square
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'; // Circle
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory'; // Triangle
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link'; // Url Link
import SendIcon from '@material-ui/icons/Send';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp'; // Line
import CreateIcon from '@material-ui/icons/Create'; // Pen
import DescriptionIcon from '@material-ui/icons/Description'; // Detail
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp'; // download

import {
  BiMinusFront, // Bring To Front
  BiMinusBack, // Send to Back
} from "react-icons/bi";

import {
  CgArrangeFront, // Bring Forward
  CgArrangeBack, // Send Backward
  CgLock, // Lock
  CgLockUnlock, // Unlock
  CgUndo, // Undo
  CgRedo, // Redo
} from "react-icons/cg";

import {
  FaRegHandRock, // Grab
  FaRegObjectGroup, // Group
  FaRegObjectUngroup, // Ungroup
} from "react-icons/fa";

import { ImQrcode } from "react-icons/im"

// 1 centimeter = (96 / 2.54) px
const cm = 96 / 2.54
const paperSize = {
  'A3': { width: 29.7 * cm, height: 42.0 * cm },
  'A4': { width: 21.0 * cm, height: 29.7 * cm },
  'A5': { width: 14.8 * cm, height: 21.0 * cm },
}

const fontFamilies = [
  "Arial",
  "Arial Black",
  "Bookman",
  "Comic Sans MS",
  "Courier",
  "Courier New",
  "Garamond",
  "Georgia",
  "Impact",
  "Palatino",
  "Tahoma",
  "Trebuchet MS",
  "Times",
  "Times New Roman",
  "Verdana"
]

const useStyles = makeStyles((theme) => ({
  chromePicker: {
    boxShadow: 'none !important',
  },
  bold: {
    fontWeight: 'bold !important'
  },
  formControl: {
    margin: theme.spacing(1),
    width: '94%',
  },
  buttonGroupTop: {
    position: 'fixed',
    left: "260px",
    top: "20px",
  },
  buttonGroupBottom: {
    position: 'fixed',
    left: "260px",
    bottom: "20px",
  }
}));

function Flyer() {
  const classes = useStyles();
  const history = useHistory()
  const theme = useTheme()
  const hiddenFileInput = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const query = new URLSearchParams(useLocation().search)
  const [canvas, setCanvas] = useState('')
  const [loading, setLoading] = useState(false)

  // flyer details
  const [project, setProject] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [publish, setPublish] = useState(true)
  const [template, setTemplate] = useState(true)

  // save
  const [saved, setSaved] = useState(false)
  const [savedState, setSavedState] = useState('')

  const [holdCtrl, setHoldCtrl] = useState(false)
  const [clipboard, setClipboard] = useState()
  const [drawing, setDrawing] = useState(false)
  const [grab, setGrab] = useState(false)
  const [expend, setExpend] = useState(false)
  const [visible, setVisible] = useState({
    'backgroundColor': false,
    'color': false,
    'borderColor': false,
    'borderWidth': false,
    'opacity': false,
    'fontSize': false,
    'fontFamily': false
  })

  const [imageUrl, setImageUrl] = useState('')

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
    loading: false
  })

  // dialog
  const [QR, setQR] = useState(false)
  const [downloadFlyer, setDownloadFlyer] = useState({
    flyerName: name,
    image: '',
    open: false,
    onClose: '',
    fullScreen: fullScreen
  })
  const [editFlyerDetails, setEditFlyerDetails] = useState(false)

  // canvas object attributes
  const [opacity, setOpacity] = useState(1)
  const [color, setColor] = useState("#000000")
  const [stroke, setStroke] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState("1")
  const [fontFamily, setFontFamily] = useState('Times New Roman')

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
    if (canvas.getActiveObjects().length !== 0) {
      canvas.remove(...canvas.getActiveObjects())
      canvas.discardActiveObject().renderAll()
    }
  }

  // get flyer data
  const data = useLocation().data
  useEffect(() => {
    async function getFlyerDetails() {
      if (data && data.canvas !== '') return setProject(data)

      setLoading(true)
      const id = query.get("id")
      await flyerAPIs.getFlyer(id)
        .then(res => {
          const data = res.data.data
          setProject(data)
          setPublish(data.public)
          setTemplate(data.template)
          setName(data.name)
          setDescription(data.description)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
          if (error.status === 404) {
            history.push('/error')
          }
        })
      setLoading(false)
    }
    getFlyerDetails()
  }, [])

  // setup canvas
  var runOnce = false
  useEffect(() => {
    if (runOnce) return
    const w = window.innerWidth
    const h = window.innerHeight
    if (project.canvas) {
      canvas.loadFromJSON(project.canvas, () => {
        canvas.item(0).set("selectable", false)
        canvas.item(0).set("hoverCursor", 'default')
      })
      setSaved(true)
      setSavedState(project.canvas)
    } else if (project.uploadFlyer) {
      fabric.Image.fromURL(project.image, function (oImg) {
        oImg.set({
          left: w / 2,
          top: h / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          hoverCursor: 'default'
        });
        canvas && canvas.add(oImg)
        canvas && save()
      });
    } else {
      const paper = new fabric.Rect({
        left: w / 2,
        top: h / 2,
        originX: 'center',
        originY: 'center',
        fill: 'white',
        width: paperSize.A5.width,
        height: paperSize.A5.height,
        selectable: false,
        hoverCursor: 'default'
      });
      canvas && canvas.add(paper)
      canvas && save()
    }
    runOnce = true
  }, [project, runOnce])

  // keyboard listener
  useEffect(() => {
    function downHandler({ key }) {
      if (!canvas.getActiveObject()) return

      // move object
      var arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (arrowKeys.includes(key)) {
        switch (key) {
          case arrowKeys[0]:
            canvas.getActiveObject().set("top", canvas.getActiveObject().top - 1)
            break;
          case arrowKeys[1]:
            canvas.getActiveObject().set("top", canvas.getActiveObject().top + 1)
            break;
          case arrowKeys[2]:
            canvas.getActiveObject().set("left", canvas.getActiveObject().left - 1)
            break;
          case arrowKeys[3]:
            canvas.getActiveObject().set("left", canvas.getActiveObject().left + 1)
            break;
          default:
            break;
        }
      }

      // delete object
      if (key === "Delete" && canvas.defaultCursor !== "text") {
        deleteCanvasObject()
      }

      // ctrl function
      if (!holdCtrl && key === "Control") {
        setHoldCtrl(true)
      }
      if (holdCtrl && key === "x" && canvas.getActiveObject()) {
        setClipboard(canvas.getActiveObject())
        deleteCanvasObject()
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

  let mousePressed = false
  // mouse listener
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
      if (canvas.getActiveObjects().length === 1) {
        const type = canvas.getActiveObject().get('type')
        switch (type) {
          case "rect":
          case "circle":
          case "triangle":
            setVisible({
              ...visible,
              'color': true,
              'borderColor': true,
              'borderWidth': true,
              'opacity': true,
              'fontFamily': false
            })
            setColor(canvas.getActiveObject().get('fill'))
            setOpacity(canvas.getActiveObject().get('opacity'))
            break;
          case "textbox":
            setVisible({
              ...visible,
              'color': true,
              'opacity': true,
              'fontFamily': true,
              'fontSize': true
            })
            break;
          case "path":
          case "line":
            setVisible({
              ...visible,
              'borderColor': true,
              'borderWidth': true,
              'opacity': true,
            })
            setColor(canvas.getActiveObject().get('stroke'))
            break;
          default:
            break;
        }
      } else {
        setVisible({
          'backgroundColor': false,
          'color': false,
          'borderColor': false,
          'borderWidth': false,
          'opacity': false,
          'fontSize': false,
          'fontFamily': false
        })
      }
    })
    canvas.on('mouse:up', function (options) {
      mousePressed = false
      // check canvas modify
      if (saved) {
        const canvasJSON = canvas.toJSON()
        setSaved(JSON.stringify(savedState) === JSON.stringify(canvasJSON))
      }
    })
    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom()
      // zoom *= 0.999 ** delta;
      zoom = zoom + (0.0001 * delta)
      zoom = Math.round(zoom * 100) / 100
      if (zoom > 3) zoom = 3
      if (zoom < 0.1) zoom = 0.1
      canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom)
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })
  }, [canvas, drawing, grab, saved, mousePressed])

  const pen = () => {
    setDrawing(!drawing)
    // canvas.freeDrawingBrush = new fabric.CircleBrush()
    canvas.freeDrawingBrush.color = "#000000"
    canvas.freeDrawingBrush.width = "10"
    canvas.isDrawingMode = !drawing;
  }

  const handleGrab = () => {
    setGrab(!grab)
    if (!grab) {
      canvas.set('selection', false)
    } else {
      canvas.setCursor('default')
      canvas.set('selection', true)
      canvas.off("mouse:move")
      canvas.renderAll()
    }
  }

  // add object
  const addObject = (e, object) => {
    e.preventDefault()
    setSaved(false)
    switch (object) {
      case 'Rect':
        Rect(canvas)
        return
      case 'Circle':
        Circle(canvas)
        return
      case 'Triangle':
        Triangle(canvas)
        return
      case 'Line':
        Line(canvas)
        return
      case 'Textbox':
        Textbox(canvas)
        return
      default:
        break
    }
  }

  // add image
  const addImage = async (e, src) => {
    e.preventDefault()
    if (src === 'file' && !e.target.files[0]) return
    if (src === 'url') {
      if (imageUrl === '') {
        return setSnackbar({ open: true, severity: "error", message: "Please provide image URL.", loading: false })
      }
      if ((imageUrl.match(/\.(jpeg|jpg|gif|png|cms|svg)$/) === null) && !imageUrl.includes('data:image/')) {
        setImageUrl('')
        return setSnackbar({ open: true, severity: "error", message: "The provided URL is not an image.", loading: false })
      }
    }
    if (src === 'file') {
      // URL.createObjectURL(e.target.files[0]) ==> temporary link for image 

      if (!e.target.files[0].type.includes("image")) return setSnackbar({ open: true, severity: "error", message: "Upload file is not an image.", loading: false })

      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0])
      reader.addEventListener("load", () => {
        var image = reader.result;
        Image({ imageSrc: image, canvas: canvas })
      });
    } else {
      Image({ imageSrc: imageUrl, canvas: canvas })
      setImageUrl('')
    }
  }

  const expendShape = (e) => {
    e.preventDefault()
    setExpend(!expend)
  }

  // dialog open and close
  const handleQR = () => {
    setQR(!QR)
  }
  const handleDownloadFlyer = () => {
    setDownloadFlyer({ ...downloadFlyer, 'open': false })
  }
  const handleEditFlyerDetails = () => {
    setEditFlyerDetails(!editFlyerDetails)
  }

  const getImageFromCanvas = () => {
    canvas.discardActiveObject().renderAll();

    // copy a rectangular zone from the canvas
    var zoom = canvas.getZoom();
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var box = canvas.toJSON().objects[0]
    var p = {
      left: (box.left - (box.width * zoom / 2)),
      top: (box.top - (box.height * zoom / 2)),
      width: box.width * zoom,
      height: box.height * zoom
    }
    var myImageData = ctx.getImageData(p.left, p.top, p.width, p.height);

    // put the rectangular zone into a buffer canvas
    var buffer = document.createElement('canvas');
    var bufferCtx = buffer.getContext("2d");
    buffer.width = myImageData.width;
    buffer.height = myImageData.height;
    bufferCtx.putImageData(myImageData, 0, 0);

    // return the canvas with image inside
    return buffer
  }

  const download = (e) => {
    const image = getImageFromCanvas()
    const imageUrl = image
      .toDataURL(`image/jpg`)
      .replace(`image/jpg}`, "image/octet-stream");

    setDownloadFlyer({ ...downloadFlyer, image: imageUrl, open: true })
  }

  const save = async () => {
    if (saved) return setSnackbar({ open: true, severity: "success", message: "Saved", loading: false })

    const canvasJSON = canvas.toJSON()
    const image = getImageFromCanvas()
    const imageData = image
      .toDataURL(`image/jpg`)
      .replace(`image/jpg}`, "image/octet-stream")

    const payload = {
      id: query.get("id"),
      editor: localStorage.getItem('user_id'),
      canvas: canvasJSON,
      image: imageData
    }

    setSnackbar({ open: true, duration: 'null', severity: "info", message: "Saving", loading: true })
    await flyerAPIs.saveFlyerChanges(payload)
      .then(res => {
        const data = res.data
        console.log(data.message)
        setSnackbar({ open: true, severity: "success", message: "Saved", loading: false })
        setSaved(true)
        setSavedState(canvasJSON)
      })
      .catch(err => {
        const response = err.response
        console.log(response)
        setSnackbar({ open: true, severity: "error", message: response, loading: false })
      })
  }

  const group = (e) => {
    e.preventDefault()
    if (canvas.getActiveObjects().length < 2) return

    var objects = canvas.getActiveObject()
    objects.clone(clonedObjects => {
      var groupObject = new fabric.Group(clonedObjects._objects)
      groupObject.set("top", canvas._activeObject.top);
      groupObject.set("left", canvas._activeObject.left);
      deleteCanvasObject()
      canvas.add(groupObject)
      canvas.setActiveObject(groupObject)
      canvas.renderAll()
    })

  }
  const ungroup = (e) => {
    e.preventDefault()
    if (canvas.getActiveObjects().length !== 1 || canvas.getActiveObject().get('type') !== 'group') return

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

  // front back
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

  // lock and unlock object
  const lockProperties = [
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
    'lockMovementX',
    'lockMovementY',
  ]
  const lock = () => {
    if (canvas.getActiveObjects().length !== 1) return

    lockProperties.forEach(property => {
      canvas.getActiveObject().set(property, true)
    })
    canvas.getActiveObject().set("hasControls", false)
    canvas.getActiveObject().set("padding", 20)
    canvas.renderAll()
  }
  const unlock = () => {
    if (canvas.getActiveObjects().length !== 1) return

    lockProperties.forEach(property => {
      canvas.getActiveObject().set(property, false)
    })
    canvas.getActiveObject().set("hasControls", true)
    canvas.getActiveObject().set("padding", 0)
    canvas.renderAll()
  }

  // listener
  const setColorListener = (value) => {
    setColor(value)
    const type = canvas.getActiveObject().get('type')
    if (type === 'line') {
      canvas.getActiveObject().set("stroke", value)
    } else {
      canvas.getActiveObject().set("fill", value)
    }
    canvas.renderAll()
  }

  const setStrokeListener = (value) => {
    setStroke(value)
    canvas.getActiveObject().set("stroke", value)
    canvas.renderAll()
  }

  const setStrokeWidthListener = (event) => {
    setStrokeWidth(event.target.value);
    canvas.getActiveObject().set("strokeWidth", event.target.value)
    canvas.renderAll()
  }

  const setOpacityListener = (value) => {
    setOpacity(value)
    canvas.getActiveObject().set("opacity", value)
    canvas.renderAll()
  }

  const setFontFamilyListener = (event) => {
    setFontFamily(event.target.value);
    canvas.getActiveObject().set("fontFamily", event.target.value)
    canvas.renderAll()
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div>
      {fullScreen && <BlockDialog />}
      <LoadingScreen open={loading} />
      <QRGenerator fullScreen={fullScreen} open={QR} onClose={handleQR} flyerName="flyer" type="pdf" url={`${process.env.REACT_APP_BASE_URL}/preview?id=${query.get("id")}`} />
      <DownloadFlyer
        flyerName={name}
        image={downloadFlyer.image}
        open={downloadFlyer.open}
        onClose={handleDownloadFlyer}
        fullScreen={downloadFlyer.fullScreen}
      />
      <EditFlyerDetailsDialog
        fullScreen={fullScreen}
        open={editFlyerDetails}
        onClose={handleEditFlyerDetails}
        flyer_id={query.get("id")}
        publish={publish}
        setPublish={setPublish}
        template={template}
        setTemplate={setTemplate}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />
      <Snackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        severity={snackbar.severity}
        loading={snackbar.loading}
      >
        {snackbar.message}
      </Snackbar>
      <Prompt
        when={!saved}
        message="You haven't save your project"
      />
      <>
        <Drawer anchor="left">
          <div>
            <Button onClick={e => {
              e.preventDefault()
              const canvasJSON = canvas.toJSON()
              canvasJSON.width = canvas.width
              canvasJSON.height = canvas.height
              console.log(canvas)
              console.log(canvasJSON)
              console.log(canvas.item(0))
              // console.log(JSON.stringify(canvasJSON))
            }}>To JSON</Button>
          </div>
          <List>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Shape</p>
            <Divider />
            <ListItem button onClick={e => addObject(e, 'Rect')}>
              <ListItemIcon><CheckBoxOutlineBlankIcon /></ListItemIcon>
              <ListItemText primary={"Square"} />
            </ListItem>
            <ListItem button onClick={e => addObject(e, 'Circle')}>
              <ListItemIcon><RadioButtonUncheckedIcon /></ListItemIcon>
              <ListItemText primary={"Circle"} />
            </ListItem>
            <ListItem button onClick={e => addObject(e, 'Triangle')}>
              <ListItemIcon><ChangeHistoryIcon /></ListItemIcon>
              <ListItemText primary={"Triangle"} />
            </ListItem>
            <ListItem button onClick={e => addObject(e, 'Line')}>
              <ListItemIcon><RemoveSharpIcon /></ListItemIcon>
              <ListItemText primary={"Line"} />
            </ListItem>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Image</p>
            <Divider />
            <ListItem button onClick={e => hiddenFileInput.current.click()}>
              <ListItemIcon><ImageIcon /></ListItemIcon>
              <ListItemText primary={"Upload Image"} />
            </ListItem>
            <input type="file" ref={hiddenFileInput} style={{ display: 'none' }} onChange={e => addImage(e, 'file')} />
            <ListItem button onClick={e => expendShape(e)}>
              <ListItemIcon><LinkIcon /></ListItemIcon>
              <ListItemText primary={"Image URL"} />
            </ListItem>
            <Collapse in={expend}>
              <ListItem>
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
            <ListItem button onClick={e => addObject(e, 'Textbox')}>
              <ListItemIcon><TextFieldsIcon /></ListItemIcon>
              <ListItemText primary={"Text"} />
            </ListItem>
            <p style={{ fontWeight: "bold", paddingLeft: "16px" }}>Drawing</p>
            <Divider />
            <ListItem button onClick={e => pen(e)}>
              <ListItemIcon><CreateIcon /></ListItemIcon>
              <ListItemText primary={"Pen"} />
            </ListItem>
          </List>
        </Drawer>
        <Drawer anchor="right">
          <ListItem button onClick={e => handleEditFlyerDetails(e)}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary={"Edit Flyer Details"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={e => download(e)}>
            <ListItemIcon><GetAppIcon /></ListItemIcon>
            <ListItemText primary={"Download Flyer"} />
          </ListItem>
          <Divider />
          <ListItem button onClick={e => handleQR(e)}>
            <ListItemIcon><ImQrcode size="24px" /></ListItemIcon>
            <ListItemText primary={"Show QR code"} />
          </ListItem>
          <Divider />
          <div style={{ display: visible.fontFamily ? '' : 'none' }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={fontFamily}
                onChange={setFontFamilyListener}
                label="Font Family"
              >
                {fontFamilies.map((font, index) => (
                  <MenuItem key={index} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: visible.color ? '' : 'none' }}>
            <Box style={{ paddingLeft: "8px" }} fontWeight="fontWeightBold" m={1}>Color</Box>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ChromePicker
                className={classes.chromePicker}
                color={color}
                onChange={color => setColorListener(color.hex)}
                disableAlpha={true}
              />
            </div>
            <Divider />
          </div>
          <div style={{ display: visible.borderColor ? '' : 'none' }}>
            <Box style={{ paddingLeft: "8px" }} fontWeight="fontWeightBold" m={1}>Border Color</Box>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ChromePicker
                className={classes.chromePicker}
                color={stroke}
                onChange={color => setStrokeListener(color.hex)}
                disableAlpha={true}
              />
            </div>
            <Divider />
          </div>
          <div style={{ display: visible.borderWidth ? '' : 'none' }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Border Width</InputLabel>
              <Select
                value={strokeWidth}
                onChange={setStrokeWidthListener}
                label="Border Width"
              >
                {[0, 0, 0, 0, 0, 0, 0].map((value, index) => (
                  <MenuItem key={index} value={index}>{index}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: visible.opacity ? '' : 'none', padding: '16px' }}>
            <Box fontWeight="fontWeightBold">Opacity</Box>
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
        </Drawer>
        <Canvas id="canvas" setCanvas={setCanvas} />
        <div className={classes.buttonGroupTop}>
          <ButtonGroup color="primary" style={{ paddingLeft: "10px" }} >
            <Tooltip arrow title="Undo (Ctrl + Z)" placement="bottom">
              <Button onClick={e => undo(e)}><CgUndo size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Redo (Ctrl + Y)" placement="bottom">
              <Button onClick={e => redo(e)}><CgRedo size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Save" placement="bottom">
              <Button onClick={e => save(e)}>
                <Badge color="error" variant="dot" invisible={saved}>
                  <SaveIcon style={{ fontSize: '1.5em' }} />
                </Badge>
              </Button>
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup color="primary" style={{ paddingLeft: "10px" }}>
            <Tooltip arrow title="Lock" placement="bottom">
              <Button onClick={e => lock(e)}><CgLock size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Unlock" placement="bottom">
              <Button onClick={e => unlock(e)}><CgLockUnlock size="1.5em" /></Button>
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup color="primary" style={{ paddingLeft: "10px" }}>
            <Tooltip arrow title="Group" placement="bottom">
              <Button onClick={e => group(e)}><FaRegObjectGroup size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Ungroup" placement="bottom">
              <Button onClick={e => ungroup(e)}><FaRegObjectUngroup size="1.5em" /></Button>
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup color="primary" style={{ paddingLeft: "10px" }}>
            <Tooltip arrow title="Bring Forward" placement="bottom">
              <Button onClick={e => bringForward(e)}><CgArrangeFront size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Bring To Front" placement="bottom">
              <Button onClick={e => bringToFront(e)}><BiMinusFront size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Send Backwards" placement="bottom">
              <Button onClick={e => sendBackwards(e)}><CgArrangeBack size="1.5em" /></Button>
            </Tooltip>
            <Tooltip arrow title="Send to Back" placement="bottom">
              <Button onClick={e => sendToBack(e)}><BiMinusBack size="1.5em" /></Button>
            </Tooltip>
          </ButtonGroup>
        </div>
        <div className={classes.buttonGroupBottom} style={{ paddingLeft: "10px" }}>
          <Tooltip arrow title="Grab" placement="top">
            <ToggleButton value="grab" selected={grab} onChange={() => handleGrab()}>
              <FaRegHandRock size="1.5em" />
            </ToggleButton>
          </Tooltip>
        </div>
      </>
    </div >
  )
}

export default Flyer
