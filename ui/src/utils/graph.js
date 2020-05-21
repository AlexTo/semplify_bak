export const createGraphNode = (node) => ({
  data: {
    id: node.value,
    projectId: node.projectId,
    graph: node.graph,
    label: node.prefLabel.value.length > 15
      ? `${node.prefLabel.value.substring(0, 15)}...` : node.prefLabel.value,
    depiction: node.depiction && `${node.depiction.value}?type=large`
  }
})

export const createGraphEdge = (triple) => ({
  data: {
    projectId: triple.projectId,
    graph: triple.graph,
    label: triple.pred.prefLabel.value,
    source: triple.subj.value,
    target: triple.obj.value,
    value: triple.pred.value
  },
  classes: 'autorotate unidirectional'
})
