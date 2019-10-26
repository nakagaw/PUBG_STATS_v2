import * as React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import styled from 'styled-components';
import { Firebase } from '../classes/Firebase';

// Material UI
import { 
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core/styles';

import {
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import {
  Home,
  Timeline,
  CloudUpload,
  CloudDownload,
  Menu,
  ChevronLeft,
} from '@material-ui/icons';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
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
      marginRight: theme.spacing(1),
    },
    hide: {
      // display: 'none',
    },
    drawer: {
      position: 'absolute',
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
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
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

const StyledNavLink= styled(NavLink)`
  &[aria-current="page"] {
    color: #88cdff;
    pointer-events: none;
    svg {
      fill: #88cdff;
    }
  }
`;

interface IProps {
  userID?: string;
  allStatsData?: any;
  // getApiDataLoading: boolean;
}

const Navbar = ({
  userID,
  allStatsData,
  // getApiDataLoading,
}: IProps) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // firebaseDB からとってきたデータをローカルストレージに上書きでぶっこむ
  const getDBdatas = (event: any) => {
    // this.setState({getApiDataLoading: true});
    const firebase = new Firebase();
    firebase.getData(userID!);
    // this.setState({getApiDataLoading: false});
  }

  // userID でテーブル作成して firebaseDB に書き込み
  const setDBdatas = (event: any) => {
    // this.setState({getApiDataLoading: true});
    const firebase = new Firebase();
    firebase.setData(userID!, allStatsData!);
    // this.setState({getApiDataLoading: false});
  }

  return(
    <React.Fragment>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, open && classes.hide)}
      >
        <Menu />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={StyledNavLink} exact to="/">
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home"/>
          </ListItem>
          <ListItem button component={StyledNavLink} exact to="/Chart">
            <ListItemIcon><Timeline /></ListItemIcon>
            <ListItemText primary="Chart"/>
          </ListItem>
        </List>
        <Divider />
        <List disablePadding>
          <ListItem button onClick={setDBdatas}>
            <ListItemIcon><CloudUpload /></ListItemIcon>
            <ListItemText primary="Backup Data"/>
          </ListItem>
          <ListItem button onClick={getDBdatas}>
            <ListItemIcon><CloudDownload /></ListItemIcon>
            <ListItemText primary="Get DB Data"/>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  )
}

export default Navbar