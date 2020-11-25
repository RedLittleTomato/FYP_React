import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useHistory } from 'react-router-dom';
import { flyerAPIs } from '../api'
import { FlyerCard, LoadingScreen } from '../components'

import {
  AppBar,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import { IoIosAddCircleOutline } from "react-icons/io";

import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AssignmentIcon from '@material-ui/icons/Assignment';
import BookmarkIcon from '@material-ui/icons/Bookmark'

const sideBarData = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    title: 'Templates',
    icon: <AssignmentIcon />
  },
  {
    title: 'Saved',
    icon: <BookmarkIcon />
  }
]

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
}))

function Dashboard() {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [loading, setLoading] = useState(false)
  const [flyers, setFlyers] = useState({
    Dashboard: [],
    Templates: [],
    Saved: []
  })
  const [open, setOpen] = useState(!fullScreen)
  const [content, setContent] = useState({
    title: 'Dashboard',
    flyers: []
  })

  useEffect(() => {
    async function getFlyers() {
      setLoading(true)
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
      setLoading(false)
    }
    getFlyers()
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
            setFlyers({ ...flyers, [title]: data })
            setContent({ 'title': title, 'flyers': data })
          })
          .catch(err => {
            const error = err.response.data
            console.log(error)
          })
        setLoading(false)
      }
      if (title === 'Saved') {
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

  const addNewFlyer = async (e) => {
    e.preventDefault()
    const payload = {
      editor: localStorage.getItem('user_id'),
    }
    await flyerAPIs.createNewFlyer(payload)
      .then(res => {
        const data = res.data
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

  const edit = (e, flyer) => {
    e.preventDefault()
    history.push({
      pathname: '/e-flyer',
      search: `?id=${flyer._id}`,
      data: flyer
    })
  }

  return (
    <div className={classes.root}>
      <LoadingScreen open={loading} />
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
          <Typography variant="h6" noWrap>
            {content.title}
          </Typography>
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
          <Button onClick={logout}>Logout</Button>
          {sideBarData.map(({ title, icon }, index) => (
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
          {content.title === 'Dashboard' && <Grid item xs={12} sm={6} md={4} lg={3}>
            <FlyerCard
              title="Add"
              name="Add new Flyer"
              icon={<IoIosAddCircleOutline style={{ fontSize: 50, minHeight: 303 }} />}
              onClick={e => addNewFlyer(e)}
            />
          </Grid>}
          {content.flyers.map((flyer, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <FlyerCard
                  id={flyer._id}
                  flyer={flyer}
                  title={content.title}
                  name={flyer.name}
                  image={flyer.image}
                  edit={e => edit(e, flyer)}
                  onClick={e => edit(e, flyer)}
                />
              </Grid>
            )
          })}
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
