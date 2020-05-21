import React, {useEffect, useState} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {visualGraphActions} from '../../../actions';
import {entityHubQueries} from '../../../graphql';
import FieldEditor from './FieldEditor';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 340,
    maxWidth: '100%'
  }
}));

function NodeInfoDrawer() {
  const classes = useStyles();
  const [triples, setTriples] = useState([]);
  const dispatch = useDispatch();
  const {projectId} = useSelector((state) => state.projectReducer);
  const {nodeInfoDrawerOpen, selectedNode} = useSelector((state) => state.visualGraphReducer);

  const [loadTriplesFromNode] = useLazyQuery(
    entityHubQueries.triplesFromNode, {
      onCompleted: (data) => {
        console.log(data.triplesFromNode)
        setTriples(data.triplesFromNode);
      },
      fetchPolicy: 'no-cache'
    }
  );

  useEffect(() => {
    if (selectedNode) {
      loadTriplesFromNode({
        variables: {
          projectId,
          uri: selectedNode,
          nodeType: 'literal'
        }
      });
    }
  }, [selectedNode]);

  const handleClose = () => {
    dispatch(visualGraphActions.closeNodeInfoDrawer());
  };


  if (!selectedNode) return null;

  return (
    <Drawer
      anchor="right"
      classes={{paper: classes.drawer}}
      ModalProps={{BackdropProps: {invisible: true}, onBackdropClick: handleClose}}
      onClose={handleClose}
      open={nodeInfoDrawerOpen}
      variant="temporary"
      style={{pointerEvents: 'none'}}
    >
      <PerfectScrollbar
        options={{suppressScrollX: true}}
        style={{pointerEvents: 'all'}}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box style={{flexGrow: 1}}/>
            <IconButton onClick={handleClose}>
              <SvgIcon fontSize="small">
                <XIcon/>
              </SvgIcon>
            </IconButton>
          </Box>
        </Box>
        {triples.map((t) => (
          <Box px={2} py={1} key={uuidv4()}>
            <FieldEditor pred={t}/>
          </Box>
        ))}
      </PerfectScrollbar>
    </Drawer>
  );
}

export default NodeInfoDrawer;
