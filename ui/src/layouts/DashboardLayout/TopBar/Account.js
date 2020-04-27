import React, {
  useRef,
  useState
} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  makeStyles
} from '@material-ui/core';
import {useKeycloak} from "@react-keycloak/web";
import {useDispatch} from "react-redux";
import {sessionActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1)
  },
  popover: {
    width: 200
  }
}));

function Account() {
  const classes = useStyles();
  const ref = useRef(null);
  const {keycloak} = useKeycloak();
  const dispatch = useDispatch();
  const {idTokenParsed: token} = keycloak;
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    keycloak.logout().then(() => {
      dispatch(sessionActions.logout())
    });
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        ref={ref}>
        {token.picture && <Avatar
          alt="User"
          className={classes.avatar}
          src={token.picture}
        />}
        {!token.picture && <Avatar
          className={classes.avatar}>
          {`${token.given_name.substring(0, 1)} ${token.family_name.substring(0, 1)}`}
        </Avatar>}
        <Hidden smDown>
          <Typography
            variant="h6"
            color="inherit"
          >
            {token.name}
          </Typography>
        </Hidden>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        keepMounted
        PaperProps={{className: classes.popover}}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
        <MenuItem
          component={RouterLink}
          to="/app/social/profile"
        >
          Profile
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/app/account"
        >
          Account
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Account;
