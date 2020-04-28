export const cyThemeDark = [
  {
    selector: "node",
    style: {
      height: 28,
      width: 28,
      'background-fit': 'cover',
      'background-image': "data(depiction)",
      "background-color": '#619ed2'
    },
  },
  {
    selector: "node[label]",
    style: {
      color: '#fff',
      label: "data(label)",
      fontSize: 10,
    }
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      color: 'rgba(255,255,255,0.7)',
      width: 3,
      fontSize: 8
    }
  },
  {
    selector: "edge",
    style: {
      width: 0.5,
      'line-color': 'white',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
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
    selector: ".center-center",
    style: {
      "text-valign": "center",
      "text-halign": "center"
    }
  },
]
