import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Link, useHistory } from 'react-router-dom';
import { flyerAPIs, userAPIs } from '../api'
import { Snackbar } from '../components/common'
import { FlyerCard, LoadingScreen } from '../components'

import {
  AppBar,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AssignmentIcon from '@material-ui/icons/Assignment';
import BookmarkIcon from '@material-ui/icons/Bookmark'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {
  AiOutlineFileAdd,
  AiOutlineCloudUpload,
  AiOutlineScan
} from 'react-icons/ai';

const sideBarData = {
  normal: [
    {
      title: 'Flyers',
      icon: <AssignmentIcon />
    },
    {
      title: 'Collection',
      icon: <BookmarkIcon />
    }
  ],
  organization: [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Templates',
      icon: <AssignmentIcon />
    },
    {
      title: 'Collection',
      icon: <BookmarkIcon />
    }
  ]
}

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f5f5f6',
    minHeight: '100vh',
  },
  appBar: {
    color: '#6699cc',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#6699cc',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  listSelected: {
    backgroundColor: '#000000'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    color: '#ffffff',
    backgroundColor: '#6699cc',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    flexGrow: 1
  }
}))

function Dashboard() {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const hiddenFileInput = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const type = localStorage.getItem('type') || "normal"
  const user_id = localStorage.getItem('user_id')

  const [open, setOpen] = useState(!fullScreen)
  const [loading, setLoading] = useState(false)
  const [flyers, setFlyers] = useState({
    Dashboard: [],
    Templates: [],
    Flyers: [],
    Collection: []
  })
  const [content, setContent] = useState({
    title: type === "normal" ? "Flyers" : "Dashboard",
    flyers: []
  })
  const [savedFlyerList, setSavedFlyerList] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
    loading: false
  })

  useEffect(() => {
    async function init() {
      setLoading(true)
      await userAPIs.getSavedFlyerList()
        .then(res => {
          const data = res.data.data
          setSavedFlyerList(data)
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
      if (type === 'organization') {
        await flyerAPIs.getFlyers()
          .then(res => {
            const data = res.data.data
            // console.log(data)
            setFlyers({ ...flyers, 'Dashboard': data })
            setContent({ 'title': 'Dashboard', 'flyers': data })
          })
          .catch(err => {
            const error = err.response
            console.log(error)
          })
      } else {
        await flyerAPIs.getLatestFlyers()
          .then(res => {
            const data = res.data.data
            setFlyers({ ...flyers, 'Flyers': data })
            setContent({ 'title': 'Flyers', 'flyers': data })
          })
          .catch(err => {
            const error = err.response
            console.log(error)
          })
      }
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (fullScreen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [fullScreen])

  const handleDrawerOpen = () => {
    setOpen(true)
  };

  const handleDrawerClose = () => {
    setOpen(false)
  };

  const handleOnChangeContent = async (e, title) => {
    e.preventDefault()
    if (open && fullScreen) setOpen(false)
    if (content.title === title) return

    setContent({ 'title': title, 'flyers': flyers[title] })

    if (flyers[title].length === 0) {
      if (title === 'Templates') {
        setLoading(true)
        await flyerAPIs.getTemplateFlyers()
          .then(res => {
            const data = res.data.data
            var filtered = data.filter(function (value) {
              return value.editor !== user_id;
            });
            setFlyers({ ...flyers, [title]: filtered })
            setContent({ 'title': title, 'flyers': filtered })
          })
          .catch(err => {
            const error = err.response.data
            console.log(error)
          })
        setLoading(false)
      }
      if (title === 'Collection') {
        setLoading(true)
        await flyerAPIs.getSavedFlyers()
          .then(res => {
            const data = res.data.data
            setFlyers({ ...flyers, [title]: data })
            setContent({ 'title': title, 'flyers': data })
          })
          .catch(err => {
            const error = err.response.data
            console.log(error)
          })
        setLoading(false)
      }
    }
  }

  const logout = () => {
    localStorage.clear()
    history.push('./login')
  }

  const addNewFlyer = async (e, src) => {
    e.preventDefault()

    if (src === 'image' && !e.target.files[0]) return

    var image = ''
    if (src === 'image' && e.target.files[0]) {
      if (!e.target.files[0].type.includes("image")) return setSnackbar({ open: true, severity: "error", message: "Uploaded file is not an image.", loading: false })
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0])
      reader.addEventListener("load", () => {
        image = reader.result;
      });
    }

    const payload = {
      editor: localStorage.getItem('user_id'),
    }
    await flyerAPIs.createNewFlyer(payload)
      .then(res => {
        const data = res.data
        if (src === 'image') {
          data.uploadFlyer = true
          data.image = image
        }
        history.push({
          pathname: '/e-flyer',
          search: `?id=${data.id}`,
          data: data
        })
      })
      .catch(err => {
        const res = err.response
        console.log(res)
      })
  }

  const handleDeleteFlyer = async (e, id, title, flyer) => {
    e.preventDefault()

    var deleted = false
    if (title === 'Dashboard') {
      await flyerAPIs.deleteFlyer(id)
        .then(res => {
          const data = res
          console.log(data)
          deleted = true
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
    }
    else if (title === 'Collection') {
      const payload = {
        save: false,
        flyer_id: id
      }
      await userAPIs.saveFlyer(payload)
        .then(res => {
          const data = res.data
          console.log(data)
          deleted = true
        })
        .catch(err => {
          const error = err.response
          console.log(error)
        })
    }

    if (deleted) {
      const index = flyers[title].indexOf(flyer);
      var filtered = flyers[title].filter(function (value, index, arr) {
        return value._id !== id;
      });
      setFlyers({ ...flyers, [title]: flyers[title].splice(index, 1) })
      setFlyers({ ...flyers, [title]: filtered });
    }
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div className={classes.root}>
      <LoadingScreen open={loading} />
      <Snackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        severity={snackbar.severity}
        loading={snackbar.loading}
      >
        {snackbar.message}
      </Snackbar>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {content.title}
          </Typography>
          <Tooltip arrow title="Scan QR code" placement="bottom">
            <IconButton color="inherit" component={Link} to="/qrcode-scanner"><AiOutlineScan /></IconButton>
          </Tooltip>
          <Tooltip arrow title="Logout" placement="bottom">
            <IconButton color="inherit" onClick={logout}><ExitToAppIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        onClose={e => setOpen(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton className={clsx(!fullScreen && classes.hide)} onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          {sideBarData[type].map(({ title, icon }, index) => (
            <ListItem className={clsx(content.title === title && classes.listSelected)} button key={index} onClick={e => handleOnChangeContent(e, title)} >
              <ListItemIcon style={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container spacing={2}>
          {content.title === 'Dashboard' &&
            <>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FlyerCard
                  title="Add"
                  name="Add new Flyer"
                  icon={<AiOutlineFileAdd style={{ fontSize: 50, minHeight: 303 }} />}
                  onClick={e => addNewFlyer(e, '')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FlyerCard
                  title="Upload"
                  name="Upload Flyer"
                  icon={<AiOutlineCloudUpload style={{ fontSize: 50, minHeight: 303 }} />}
                  onClick={e => hiddenFileInput.current.click()}
                />
                <input type="file" ref={hiddenFileInput} style={{ display: 'none' }} onChange={e => addNewFlyer(e, 'image')} />
              </Grid>
            </>
          }
          {content.flyers.map((flyer, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <FlyerCard
                  type={type}
                  like={flyer.like.includes(user_id)}
                  save={savedFlyerList.includes(flyer._id)}
                  id={flyer._id}
                  flyer={flyer}
                  title={content.title}
                  name={flyer.name}
                  image={flyer.image}
                  deleteFlyer={handleDeleteFlyer}
                />
              </Grid>
            )
          })}
          {content.title === 'Flyers' && content.flyers.length === 0 &&
            <p>No flyer created</p>
          }
          {content.title === 'Templates' && content.flyers.length === 0 &&
            <p>No template flyer recommended</p>
          }
          {content.title === 'Saved' && content.flyers.length === 0 &&
            <p>No flyer saved</p>
          }
        </Grid>
      </div>

    </div>
  )
}

export default Dashboard
