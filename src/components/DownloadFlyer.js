import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { jsPDF } from "jspdf"

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

function DownloadFlyer(props) {
  const classes = useStyles()
  const { flyerName, image, open, onClose, fullScreen } = props
  const size = 256

  const [type, setType] = useState('PNG');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const downloadFlyer = () => {
    const canvas = document.getElementById("QRcode");
    if (type === "pdf") {
      const imageUrl = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        unit: "px",
        format: [size - 110, size - 110]
      });
      pdf.addImage(imageUrl, 'JPEG', 0, 0);
      pdf.save(`${flyerName}.pdf`);
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
          <img src={image} alt={flyerName} />
          <FormControl className={classes.formControl}>
            <FormLabel>File Type</FormLabel>
            <RadioGroup row value={type} onChange={handleChange}>
              <FormControlLabel value="PNG" control={<Radio />} label="PNG" />
              <FormControlLabel value="JPEG" control={<Radio />} label="JPEG" />
              <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
            </RadioGroup>
          </FormControl>
          <Button onClick={downloadFlyer} variant="contained" color="primary">Download Flyer</Button>
        </Grid>
      </Dialog>
    </div>
  )
}

export default DownloadFlyer