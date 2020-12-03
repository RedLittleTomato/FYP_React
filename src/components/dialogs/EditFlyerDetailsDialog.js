import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { flyerAPIs } from '../../api'
import { Snackbar } from '../common'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '50px',
    [theme.breakpoints.down('sm')]: {
      height: '100vh'
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

function EditFlyerDetailsDialog(props) {
  const classes = useStyles()
  const { flyer_id, name, description, setName, setDescription, publish, setPublish, template, setTemplate, open, onClose, fullScreen } = props
  const [updating, setUpdating] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
    loading: false
  })

  const handlePublishChange = (event) => {
    setPublish(event.target.checked);
  };

  const handleTemplateChange = (event) => {
    setTemplate(event.target.checked);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdate = async () => {
    const payload = {
      id: flyer_id,
      editor: localStorage.getItem('user_id'),
      public: publish,
      template: template,
      name: name,
      description: description
    }
    setUpdating(true)
    await flyerAPIs.saveFlyerDetailsChanges(payload)
      .then(res => {
        const data = res.data
        console.log(data.message)
        setSnackbar({ ...snackbar, open: true, message: data.message })
      })
      .catch(err => {
        const response = err.response
        console.log(response)
      })
    setUpdating(false)
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        severity={snackbar.severity}
        loading={snackbar.loading}
      >
        {snackbar.message}
      </Snackbar>
      <Dialog maxWidth="xs" fullScreen={fullScreen} open={open} onClose={onClose} >
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <DialogTitle>Edit Flyer Details</DialogTitle>
        <DialogContent style={{ paddingBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: "50%", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: "bold", paddingLeft: "5px" }}>Public</p>
              <Switch
                checked={publish}
                onChange={handlePublishChange}
                color="primary"
              />
            </div>
            <div style={{ width: "50%", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: "bold", paddingLeft: "5px" }}>Template</p>
              <Switch
                checked={template}
                onChange={handleTemplateChange}
                color="primary"
              />
            </div>

          </div>
          <TextField
            margin="dense"
            label="Name"
            variant="outlined"
            value={name}
            onChange={e => handleNameChange(e)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            variant="outlined"
            value={description}
            onChange={e => handleDescriptionChange(e)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Updated {updating && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EditFlyerDetailsDialog