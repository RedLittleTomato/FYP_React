import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { flyerAPIs, userAPIs } from '../api'
import { LoadingScreen, Login } from '../components'
import { DownloadFlyer, QRGenerator } from '../components/dialogs'

import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close'
import DownloadIcon from '@material-ui/icons/GetApp'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'

import { ImQrcode } from "react-icons/im";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f5f5f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  gridItem: {
    backgroundColor: '#ffffff',
    width: '100%'
  },
  iconButton: {
    backgroundColor: 'transparent'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  title: {
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '16px',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#6699cc'
  }
}));

function Preview() {
  const classes = useStyles();
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [loading, setLoading] = useState(false)
  const [like, setLike] = useState(false)
  const [bookmark, setBookmark] = useState(false)
  const [flyer, setFlyer] = useState({
    name: '',
    likes: 0
  })
  const [login, setLogin] = useState(false)
  const [qr, setQr] = useState(false)
  const [download, setDownload] = useState(false)

  useEffect(() => {
    const flyer_id = query.get("id")
    if (!flyer_id) {
      history.push('/error')
    }
    setLoading(true)
    async function getPreviewFlyer() {
      await flyerAPIs.getPreviewFlyer(flyer_id)
        .then(res => {
          const data = res.data.data

          data.likes = data.like.length
          if (data.like.includes(localStorage.getItem('user_id'))) {
            data.likes--
            setLike(true)
          }

          setFlyer(data)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
          if (error.status === 400 || error.status === 404) {
            history.push('/error')
          }
        })
    }
    async function checkSavedFlyer() {
      if (!localStorage.getItem('user_id')) return

      const payload = {
        params: {
          flyer_id: flyer_id
        }
      }
      await userAPIs.checkSavedFlyer(payload)
        .then(res => {
          const data = res.data
          if (data.saved) {
            setBookmark(true)
          }
        })
        .catch(err => {
          const res = err
          console.log(res)
        })
    }
    getPreviewFlyer()
    checkSavedFlyer()
    setLoading(false)
  }, [])

  const handleLogin = () => {
    if (localStorage.getItem('user_id')) return true
    setLogin(true)
  }

  const handleQR = () => {
    setQr(true)
  }

  const handleLike = async () => {
    const login = handleLogin()
    if (!login) return

    setLike(!like)
    const flyer_id = query.get("id")
    const payload = {
      like: !like,
      flyer_id: flyer_id
    }
    await flyerAPIs.likeFlyer(payload)
      // .then(res => {
      //   const data = res.data
      //   console.log(data)
      // })
      .catch(err => {
        const res = err
        console.log(res)
      })
  }

  const handleBookmark = async () => {
    const login = handleLogin()
    if (!login) return

    setBookmark(!bookmark)
    const flyer_id = query.get("id")
    const payload = {
      save: !bookmark,
      flyer_id: flyer_id
    }
    await userAPIs.saveFlyer(payload)
      // .then(res => {
      //   const data = res.data
      //   console.log(data)
      // })
      .catch(err => {
        const res = err
        console.log(res)
      })
  }

  const handleDownload = () => {
    setDownload(true)
  }

  const handleOnClose = () => {
    setDownload(false)
    setLogin(false)
    setQr(false)
  }

  return (
    <div className={classes.root}>
      <LoadingScreen open={loading} />
      <QRGenerator fullScreen={fullScreen} flyerName={flyer.name} url={window.location.href} open={qr} onClose={handleOnClose} />
      <DownloadFlyer fullScreen={fullScreen} flyerName={flyer.name} image={flyer.image} open={download} onClose={handleOnClose} />
      <Dialog fullScreen={fullScreen} maxWidth="xs" open={login} onClose={handleOnClose}>
        <IconButton className={classes.closeButton} onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
        <DialogContent className={classes.dialogContent}>
          <Login dialog={query.get("id")} handleOnClose={handleOnClose} />
        </DialogContent>
      </Dialog>
      <Container maxWidth="xs" >
        <Grid container style={{ backgroundColor: 'white', marginTop: '75px', padding: '10px', }}>
          <Grid item className={classes.gridItem}>
            <Typography component="div" className={classes.title}>
              <Box fontSize={20} fontWeight="fontWeightBold" >
                {flyer.name}
              </Box>
              <IconButton className={classes.iconButton} onClick={handleQR}>
                <ImQrcode />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item className={classes.gridItem} style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={flyer.image} alt={flyer.name} width="100%" height="auto" loading="lazy" />
          </Grid>
          <Grid item className={classes.gridItem}>
            <Typography component="div" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <IconButton className={classes.iconButton} onClick={handleLike}>
                  {like ? <FavoriteIcon style={{ color: "#ed4956" }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton className={classes.iconButton} onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </div>
              <IconButton className={classes.iconButton} onClick={handleBookmark}>
                {bookmark ? <BookmarkIcon style={{ color: "#000000" }} /> : <BookmarkBorderIcon />}
              </IconButton>
            </Typography>
          </Grid>
          <Grid item className={classes.gridItem} style={{ paddingLeft: '16px' }} >
            {like ?
              (flyer.likes !== 0 ? `You and ${flyer.likes} users liked` : 'You liked') :
              (flyer.likes !== 0 ? `${flyer.likes} users liked` : '0 user liked')}
          </Grid>
          <Grid item className={classes.gridItem} style={{ padding: '16px' }} >
            {flyer.description !== '' ? flyer.description : 'No description'}
          </Grid>
        </Grid>
      </Container>
    </div >
  )
}

export default Preview
