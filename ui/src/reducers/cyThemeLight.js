export const cyThemeLight = [
  {
    selector: "node",
    style: {
      height: 28,
      width: 28,
      'background-fit': 'cover',
      'background-image': "data(depiction)",
      "background-color": '#393333'
    },
  },
  {
    selector: "node:selected",
    style: {
      'border-color': 'red',
      'border-width': 2
    },
  },
  {
    selector: "node[label]",
    style: {
      color: '#131111',
      label: "data(label)",
      fontSize: 10,
    }
  },
  {
    selector: "edge[label]",
    style: {

      label: "data(label)",
      width: 3,
      fontSize: 8
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
