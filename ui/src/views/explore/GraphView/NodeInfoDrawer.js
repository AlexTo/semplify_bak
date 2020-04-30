import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Drawer,
  IconButton,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import {
  XCircle as XIcon
} from 'react-feather';
import {useSelector, useDispatch} from "react-redux";
import {visualGraphActions} from "../../../actions";

const useStyles = makeStyles(() => ({
  drawer: {
    width: 340,
    maxWidth: '100%'
  }
}));

function NodeInfoDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {nodeInfoDrawerOpen, selectedNode} = useSelector(state => state.visualGraphReducer);

  const handleClose = () => {
    dispatch(visualGraphActions.closeNodeInfoDrawer())
  };

  if (!selectedNode) return null;

  return (
    <Drawer
      anchor="right"
      classes={{paper: classes.drawer}}
      ModalProps={{BackdropProps: {invisible: true}}}
      onClose={handleClose}
      open={nodeInfoDrawerOpen}
      variant="temporary"
      style={{pointerEvents: 'none'}}>
      <PerfectScrollbar options={{suppressScrollX: true}}
                        style={{pointerEvents: 'all'}}>
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <Box style={{flexGrow: 1}}/>
            <IconButton onClick={handleClose}>
              <SvgIcon fontSize="small">
                <XIcon/>
              </SvgIcon>
            </IconButton>
          </Box>
        </Box>
      </PerfectScrollbar>
    </Drawer>
  );
}

export default NodeInfoDrawer;
