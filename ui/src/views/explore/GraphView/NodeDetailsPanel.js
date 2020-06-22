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
import {Pagination} from "@material-ui/lab";

function applyPagination(triples, page, limit) {
  return triples.slice(page * limit, page * limit + limit);
}

function NodeDetailsPanel() {
  const [node, setNode] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
        const {triplesFromNode} = data;
        const {triples} = triplesFromNode;
        setTriples(triples);
      },
      fetchPolicy: 'no-cache'
    }
  );

  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    loadTriplesFromNode({
      variables: {
        projectId,
        subj: selectedNode.id(),
        nodeType: 'literal'
      }
    });
    loadNode({
      variables: {
        projectId,
        uri: selectedNode.id()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  if (!selectedNode) return null;

  const paginatedTriples = applyPagination(triples, page - 1, limit);

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

      {paginatedTriples.map((t) => (
        <Box px={2} py={1} key={uuidv4()}>
          <FieldEditor triple={t}/>
        </Box>
      ))}
      {triples.length > 0 && <Box
        mt={6}
        display="flex"
        justifyContent="center"
      >
        <Pagination
          count={Math.ceil(triples.length / limit)}
          page={page}
          onChange={handlePageChange}/>
      </Box>}
    </PerfectScrollbar>
  );
}

export default NodeDetailsPanel;
