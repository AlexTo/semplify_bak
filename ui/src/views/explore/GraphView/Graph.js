import React, {useEffect, useState} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import cxtmenu from 'cytoscape-cxtmenu';
import {Maximize2, MapPin, Trash} from 'react-feather';
import {useDispatch, useSelector} from "react-redux";
import {renderToString} from 'react-dom/server'
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import {useSnackbar} from "notistack";
import {visualGraphActions} from "../../../actions";

cytoscape.use(cola);
cytoscape.use(cxtmenu);


function Graph() {

  const [cy, setCy] = useState(null);
  const {theme} = useSelector(state => state.cyReducer)
  const layout = {name: "cola"};
  const {enqueueSnackbar} = useSnackbar();
  const {nodes, edges} = useSelector(state => state.visualGraphReducer)
  const dispatch = useDispatch();


  const [loadPredicatesFromNode] = useLazyQuery(
    entityHubQueries.predicatesFromNode, {
      onCompleted: data => {
        const {predicatesFromNode} = data;
        const edgesToAdd = predicatesFromNode.filter(p => p.to.__typename === 'IRI');
        if (edgesToAdd.length === 0) {
          enqueueSnackbar('This node has no other connections', {
            variant: 'success'
          });
          return;
        }
        dispatch(visualGraphActions.addEdges(edgesToAdd));
      },
      fetchPolicy: 'no-cache'
    });

  useEffect(() => {
    if (cy) {
      cy.cxtmenu(menu);
    }
  }, [cy])

  useEffect(() => {
    if (cy) {
      cy.layout(layout).run();
    }
  }, [nodes, edges])

  const createMenuItems = () => {
    return [
      {
        content: renderToString(<Trash size={16}/>),
        select: function (ele) {
          dispatch(visualGraphActions.removeNode(ele.id()))
        },
      },
      {
        content: renderToString(<MapPin size={16}/>),
        select: function (ele) {
        },
      },
      {
        content: renderToString(<Maximize2 size={16}/>),
        select: function (ele) {
          loadPredicatesFromNode({
            variables: {
              projectId: ele.data().projectId,
              uri: ele.id()
            }
          })
        },
      },
    ]
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
                        style={{width: '100%', height: '100%'}}/>
  )
}

export default Graph;
