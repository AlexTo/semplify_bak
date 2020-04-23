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
