import React, {useEffect, useState} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import avsdf from 'cytoscape-avsdf';
import cise from 'cytoscape-cise';
import coseBilkent from 'cytoscape-cose-bilkent';
import fcose from 'cytoscape-fcose';
import euler from 'cytoscape-euler';
import spread from 'cytoscape-spread';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import cxtmenu from 'cytoscape-cxtmenu';
import {Maximize2, MapPin, Trash, ExternalLink, List} from 'react-feather';
import {useDispatch, useSelector} from "react-redux";
import {renderToString} from 'react-dom/server'
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import {useSnackbar} from "notistack";
import {visualGraphActions} from "../../../actions";

cytoscape.use(avsdf);
cytoscape.use(cola);
cytoscape.use(cise);
cytoscape.use(coseBilkent)
cytoscape.use(euler);
cytoscape.use(fcose);
cytoscape.use(spread);
cytoscape.use(dagre);
cytoscape.use(klay);
cytoscape.use(cxtmenu);

function Graph() {

  const [cy, setCy] = useState(null);
  const {theme} = useSelector(state => state.cyReducer)
  const {enqueueSnackbar} = useSnackbar();
  const {projectId} = useSelector(state => state.projectReducer);
  const {nodes, edges, centerFocus, fit, layout, refreshLayout} = useSelector(state => state.visualGraphReducer)
  const dispatch = useDispatch();

  const [loadTriplesFromNode] = useLazyQuery(
    entityHubQueries.triplesFromNode, {
      onCompleted: data => {
        const {triplesFromNode} = data;
        const {triples} = triplesFromNode
        if (triples.length === 0) {
          enqueueSnackbar('This node has no other connections', {
            variant: 'success'
          });
          return;
        }
        dispatch(visualGraphActions.addTriples(triples));
      },
      fetchPolicy: 'no-cache'
    });

  useEffect(() => {
    if (cy) cy.center();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerFocus]);

  useEffect(() => {
    if (cy) cy.fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit]);

  useEffect(() => {
    if (cy) cy.layout(layout).run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshLayout])

  useEffect(() => {
    if (!cy) {
      return;
    }
    cy.on('select', 'node', function (e) {
      let node = e.target;
      dispatch(visualGraphActions.selectNode(node.data().isCompound ? null : node))
    });

    cy.on('unselect', 'node', function () {
      dispatch(visualGraphActions.selectNode(null))
    })

    cy.cxtmenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cy])

  const expandNode = (node) => {
    loadTriplesFromNode({
      variables: {
        projectId: node.data().projectId,
        subj: node.id(),
        nodeType: 'iri'
      }
    })
  }

  const expandCompoundNode = (node) => {
    loadTriplesFromNode({
      variables: {
        projectId: node.data().projectId,
        subj: node.data().subj,
        pred: node.data().pred,
        nodeType: 'iri'
      }
    })
  }

  const createMenuItems = (node) => {
    const commands = [
      {
        content: renderToString(<Trash size={16}/>),
        select: () => dispatch(visualGraphActions.removeNode(node))
      },
      {
        content: renderToString(<MapPin size={16}/>),
        select: () => {
        },
      },
      {
        content: renderToString(<Maximize2 size={16}/>),
        select: node.data().isCompound ? expandCompoundNode : expandNode,
      }
    ]
    if (!node.data().isCompound) {
      commands.splice(2, 0, {
        content: renderToString(<ExternalLink size={16}/>),
        select: () => window.open(`/node?uri=${encodeURIComponent(node.id())}&projectId=${projectId}`, "_blank")
      });
    } else {
      commands.splice(2, 0, {
        content: renderToString(<List size={16}/>),
        select: () => dispatch(visualGraphActions.openCompoundNodeExpansionDialog(node))
      });
    }
    return commands;
  }

  const menu = {
    menuRadius: 55,
    selector: 'node',
    commands: createMenuItems,
    fillColor: 'rgba(138,180,219,0.75)',
    activeFillColor: 'rgba(1, 105, 217, 0.75)',
    activePadding: 0,
    indicatorSize: 12,
    separatorWidth: 3,
    spotlightPadding: 0,
    minSpotlightRadius: 24,
    maxSpotlightRadius: 24,
    itemColor: 'white',
    itemTextShadowColor: 'transparent',
    openMenuEvents: 'cxttapstart taphold',
    zIndex: 9999,
    atMouse: false
  };

  return (
    <CytoscapeComponent elements={CytoscapeComponent.normalizeElements({nodes, edges})}
                        cy={cy => setCy(cy)}
                        layout={layout}
                        stylesheet={theme}
                        zoom={1}
                        wheelSensitivity={0.25}
                        style={{width: '100%', height: '100%'}}/>
  )
}

export default Graph;
