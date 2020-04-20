import React, {useEffect, useRef, useState} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import cxtmenu from 'cytoscape-cxtmenu';
import {Maximize2, MapPin, Trash} from 'react-feather';
import {useSelector} from "react-redux";
import {renderToString} from 'react-dom/server'

cytoscape.use(cola);
cytoscape.use(cxtmenu);


function Graph({graphData, onNodeExpanded, onNodeRemoved, onNodePinned}) {

  const [cy, setCy] = useState(null);
  const {style} = useSelector(state => state.cyReducer)
  const layout = {name: "cola"};
  useEffect(() => {
    if (cy) {
      cy.cxtmenu(menu);
    }
  }, [cy])

  useEffect(() => {
    if (cy) {
      cy.layout(layout).run();
    }
  }, [graphData])

  const createMenuItems = () => {
    return [
      {
        content: renderToString(<Trash size={16}/>),
        select: function (ele) {
          onNodeRemoved(ele.id())
        },
      },
      {
        content: renderToString(<MapPin size={16}/>),
        select: function (ele) {
          onNodePinned(ele.id())
        },
      },
      {
        content: renderToString(<Maximize2 size={16}/>),
        select: function (ele) {
          onNodeExpanded(ele.data())
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
    openMenuEvents: 'tap',
    zIndex: 9999,
    atMouse: false
  };

  return (
    <CytoscapeComponent elements={graphData}
                        cy={cy => setCy(cy)}
                        layout={layout}
                        stylesheet={style}
                        style={{width: '100%', height: '100%'}}/>
  )
}

export default Graph;
