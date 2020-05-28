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
import {useLazyQuery} from '@apollo/react-hooks';
import {visualGraphActions} from '../../../actions';
import {entityHubQueries} from '../../../graphql';
import FieldEditor from './FieldEditor';

function NodeDetailsPanel() {
  const [triples, setTriples] = useState([]);
  const {projectId} = useSelector((state) => state.projectReducer);
  const {selectedNode} = useSelector((state) => state.visualGraphReducer);

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


  if (!selectedNode) return null;

  return (
    <PerfectScrollbar
      options={{suppressScrollX: true}}
      style={{pointerEvents: 'all'}}>
      {triples.map((t) => (
        <Box px={2} py={1} key={uuidv4()}>
          <FieldEditor pred={t}/>
        </Box>
      ))}
    </PerfectScrollbar>
  );
}

export default NodeDetailsPanel;
