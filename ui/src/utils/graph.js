export const createGraphNode = (node) => {
  let n = {
    data: {
      id: node.value,
      projectId: node.projectId,
      graph: node.graph,
      subj: node.subj, // only available with compound node
      pred: node.pred, // only available with compound node
      label: node.prefLabel.value.length > 15
        ? `${node.prefLabel.value.substring(0, 15)}...` : node.prefLabel.value,
      isCompound: isCompound(node)
    },
    classes: `${isCompound(node) ? "compound center-center" : ""}`
  }
  if (node.depiction)
    n.data.depiction = `${node.depiction.value}?type=large`;
  return n;
}

export const createGraphEdge = (triple) => {
  let p = {
    data: {
      projectId: triple.projectId,
      graph: triple.graph,
      source: triple.subj.value,
      target: triple.obj.value,
      value: triple.pred.value
    },
    classes: 'autorotate unidirectional'
  }
  if (triple.pred.prefLabel) {
    p.data.label = triple.pred.prefLabel.value;
  }
  return p;
}

export const isCompound = (node) => node.value.startsWith("_compound://")
