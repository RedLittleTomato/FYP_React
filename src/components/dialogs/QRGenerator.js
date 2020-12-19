import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react'
import { jsPDF } from "jspdf"
import logo from '../../images/flyer.png'

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Dialog,
  Grid,
  IconButton,
  Radio,
  RadioGroup
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '50px',
    // paddingBottom: '16px',
    [theme.breakpoints.down('sm')]: {
      height: '100vh'
    },
  },
  formControl: {
    padding: '16px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

function QRGenerator({ flyerName, url, open, onClose, fullScreen }) {
  const classes = useStyles()
  const size = 256
  const imageSettings = {
    src: logo,
    height: size * 2 / 10,
    width: size * 2 / 10,
    // excavate: true // logo with white background
  }

  const [type, setType] = useState('PNG');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("QRcode");
    if (type === "PDF") {
      const imageUrl = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        unit: "px",
        format: [size - 112, size - 112]
      });
      pdf.addImage(imageUrl, 'JPEG', 0, 0);
      pdf.save(`${flyerName}-QRcode.pdf`);
    } else {
      const imageUrl = canvas
        .toDataURL(`image/${type}`)
        .replace(`image/${type}`, "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = `${flyerName}.${type}`;
      downloadLink.click();
    }
    onClose()
  }

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <QRCode
            id="QRcode"
            value={url}
            imageSettings={imageSettings}
            size={size}
            level={"H"}
          />
          <FormControl className={classes.formControl}>
            <FormLabel>File Type</FormLabel>
            <RadioGroup row value={type} onChange={handleChange}>
              <FormControlLabel value="PNG" control={<Radio />} label="PNG" />
              <FormControlLabel value="JPEG" control={<Radio />} label="JPEG" />
              <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
            </RadioGroup>
          </FormControl>
          <Button onClick={downloadQR} variant="contained" color="primary">Download QR code</Button>
        </Grid>
      </Dialog>
    </div>
  )
}

export default QRGenerator