import React, {useState} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';

cytoscape.use(cola);

function Graph() {

  const [cy, setCy] = useState(null);

  const elements = [
    {data: {id: '1', label: '1'}},
    {data: {id: '2', label: '2'}},
    {data: {id: '3', label: '3'}},
    {data: {id: '4', label: '4'}},
    {data: {id: '5', label: '5'}},
    {data: {id: '6', label: '6'}},
    {data: {id: '7', label: '7'}},
    {data: {id: '8', label: '8'}},
    {data: {source: '1', target: '2', label: 'Edge from Node1 to Node2'}},
    {data: {source: '1', target: '3', label: 'Edge from Node1 to Node2'}},
    {data: {source: '2', target: '3', label: 'Edge from Node1 to Node2'}},
    {data: {source: '3', target: '4', label: 'Edge from Node1 to Node2'}},
    {data: {source: '4', target: '5', label: 'Edge from Node1 to Node2'}},
    {data: {source: '4', target: '6', label: 'Edge from Node1 to Node2'}},
    {data: {source: '3', target: '7', label: 'Edge from Node1 to Node2'}},
    {data: {source: '3', target: '8', label: 'Edge from Node1 to Node2'}},
  ];
  return (
    <CytoscapeComponent elements={elements}
                        cy={(cy) => setCy(cy)}
                        layout={{name: "cola"}}
                        style={{width: '100%', height: '100%'}}/>
  )
}

export default Graph;
