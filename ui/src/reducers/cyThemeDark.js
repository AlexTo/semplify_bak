export const cyThemeDark = [
  {
    selector: "node",
    style: {
      height: 28,
      width: 28,
      "background-color": '#619ed2',
    },
  },
  {
    selector: "node[depiction]",
    style: {
      'background-fit': 'cover',
      'background-image': "data(depiction)",
    }
  },
  {
    selector: "node:selected",
    style: {
      'border-color': 'red',
      'border-width': 2
    },
  },
  {
    selector: "node.compound",
    style: {
      shape: "rectangle",
      "background-color": '#61d274',
    }
  },
  {
    selector: "node[label]",
    style: {
      color: '#fff',
      label: "data(label)",
      fontSize: 8,
    }
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      color: 'rgba(255,255,255,0.7)',
      width: 3,
      fontSize: 8,
      "text-margin-y": "-5px"
    }
  },
  {
    selector: "edge",
    style: {
      width: 0.5,
      'line-color': 'white',
      'curve-style': 'bezier',
      'arrow-scale': 0.5
    }
  },
  {
    selector: ".autorotate",
    style: {
      "text-valign": "top",
      "edge-text-rotation": "autorotate"
    }
  },
  {
    selector: ".unidirectional",
    style: {
      'target-arrow-shape': 'triangle',
    }
  },
  {
    selector: ".bidirectional",
    style: {
      'target-arrow-shape': 'triangle',
      'source-arrow-shape': 'triangle',
    }
  },
  {
    selector: ".center-center",
    style: {
      "text-valign": "center",
      "text-halign": "center"
    }
  },
]
