import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { flyerAPIs, userAPIs } from '../api'

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Create'
import PreviewIcon from '@material-ui/icons/Visibility'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles({
  root: {
    position: "relative",
    minHeight: "385px",
    margin: '16px',
    textAlign: 'center',
    borderBottomStyle: 'solid',
  },
  hover: {
    height: "100%",
    left: "0",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: 2,
    transition: "background-color 350ms ease",
    backgroundColor: "rgba(0,0,0,.5)",
    boxSizing: "border-box",
  },
  hoverComponent: {
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '60%',
    margin: '10px'
  },
  cardActionArea: {
    padding: '16px',
  },
  cardActions: {
    textAlign: 'center',
  },
  image: {
    // minHeight: 303,
    borderStyle: 'solid',
    borderRadius: '5px'
  }
})

function FlyerCard(props) {
  const classes = useStyles()
  const { id, flyer, title, icon, image, name, onClick } = props
  const history = useHistory()
  const [hover, setHover] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOnHover = () => {
    setHover(true)
  }

  const handleLeaveHover = () => {
    setHover(false)
  }

  const handleOnEdit = async (e) => {
    e.preventDefault()
    const payload = {
      'name': flyer.name,
      'description': flyer.description,
      'canvas': flyer.canvas,
      'image': flyer.image,
      'editor': localStorage.getItem('user_id'),
      'like': [],
      'public': true,
      'template': true
    }
    if (title !== 'Dashboard') {
      await flyerAPIs.createNewFlyer(payload)
        .then(res => {
          const data = res.data
          // console.log(data)
          history.push(`/e-flyer?id=${data.id}`)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
    } else {
      history.push(`/e-flyer?id=${id}`)
    }
  }

  const handleOnPreview = (e) => {
    e.preventDefault()
    // const win = window.open(`${process.env.REACT_APP_BASE_URL}/preview?id=${id}`, "")
    // win.focus()
    // history.push(`/preview?id=${id}`)
  }

  const handleOnBookmark = (e) => {

  }

  const handleOnDelete = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (title === 'Dashboard') {
      await flyerAPIs.deleteFlyer(id)
        .then(res => {
          const data = res
          console.log(data)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
    }
    else if (title === 'Saved') {
      const payload = {
        save: false,
        flyer_id: id
      }
      await userAPIs.saveFlyer(payload)
        .then(res => {
          const data = res.data
          console.log(data)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
    }
    setIsLoading(false)
    window.location.reload()
  }

  return (
    <>
      <Card className={classes.root} onMouseOver={handleOnHover} onMouseLeave={handleLeaveHover}>
        {title !== 'Add' && hover && <div className={classes.hover}>
          <div className={classes.hoverComponent}>
            <Button className={classes.button} variant="contained" color="primary" onClick={e => handleOnEdit(e)} startIcon={<EditIcon />}>
              {title === 'Dashboard' ? 'Edit' : 'Use'}
            </Button>
            <Button className={classes.button} variant="contained" color="primary" component={Link} to={`/preview?id=${id}`} target="_blank" startIcon={<PreviewIcon />}>
              Preview
            </Button>
            {title === 'Templates' && <Button className={classes.button} variant="contained" color="primary" onClick={e => handleOnBookmark(e)} startIcon={<BookmarkIcon />}>
              Save
            </Button>}
            {title !== 'Templates' && <Button className={classes.button} variant="contained" color="primary" onClick={e => handleOnDelete(e)} startIcon={<DeleteIcon />}>
              Delete {isLoading && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
            </Button>}
          </div>
        </div>}
        <CardActionArea className={classes.cardActionArea} onClick={onClick}>
          {image && <img className={classes.image} src={image} alt={name} />}
          {icon && icon}
          <CardContent>
            {name}
          </CardContent>
        </CardActionArea>
        {/* <CardActions className={classes.cardActions}>
          {name}
        </CardActions> */}
      </Card>
    </>
  )
}

export default FlyerCard
