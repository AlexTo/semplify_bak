export const createGraphNode = (node) => ({
  data: {
    id: node.value,
    projectId: node.projectId,
    graph: node.graph,
    label: node.prefLabel.value.length > 15
      ? `${node.prefLabel.value.substring(0, 15)}...` : node.prefLabel.value
  },
  classes: 'center-center'
})

export const createGraphEdge = (pred) => ({
  data: {
    projectId: pred.projectId,
    graph: pred.graph,
    label: pred.prefLabel.value,
    source: pred.from.value,
    target: pred.to.value
  },
  classes: 'autorotate'
})
