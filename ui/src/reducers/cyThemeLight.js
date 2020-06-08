export const cyThemeLight = [
  {
    selector: "node",
    style: {
      height: 28,
      width: 28,
      "background-color": '#393333'
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
      "background-color": '#6181d2',
    }
  },
  {
    selector: "node[label]",
    style: {
      color: '#131111',
      label: "data(label)",
      fontSize: 8,
    }
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      width: 3,
      fontSize: 8,
      "text-margin-y": "-5px"
    }
  },
  {
    selector: "edge",
    style: {
      width: 0.5,
      'curve-style': 'bezier',
      'arrow-scale': 0.5
    }
  },
  {
    selector: ".autorotate",
    style: {
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
