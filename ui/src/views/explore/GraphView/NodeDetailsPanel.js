import React, {useEffect, useState} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box, Tooltip, Typography
} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import {useLazyQuery} from '@apollo/react-hooks';
import {entityHubQueries} from '../../../graphql';
import FieldEditor from './FieldEditor';

function NodeDetailsPanel() {
  const [node, setNode] = useState(null);
  const [triples, setTriples] = useState([]);
  const {projectId} = useSelector((state) => state.projectReducer);
  const {selectedNode} = useSelector((state) => state.visualGraphReducer);

  const [loadNode] = useLazyQuery(
    entityHubQueries.node, {
      onCompleted: (data) => {
        setNode(data.node)
      },
      fetchPolicy: "no-cache"
    }
  )

  const [loadTriplesFromNode] = useLazyQuery(
    entityHubQueries.triplesFromNode, {
      onCompleted: (data) => {
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
          subj: selectedNode,
          nodeType: 'literal'
        }
      });
      loadNode({
        variables: {
          projectId,
          uri: selectedNode
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);


  if (!selectedNode) return null;

  return (
    <PerfectScrollbar
      options={{suppressScrollX: true}}
      style={{pointerEvents: 'all'}}>
      {node && <Box px={2} py={1}>
        <Tooltip title={node.value} placement="left">
          <Typography
            variant="body1"
            color="textPrimary">
            {node.prefLabel.value}
          </Typography>
        </Tooltip>
      </Box>}

      {triples.map((t) => (
        <Box px={2} py={1} key={uuidv4()}>
          <FieldEditor pred={t}/>
        </Box>
      ))}
    </PerfectScrollbar>
  );
}

export default NodeDetailsPanel;
