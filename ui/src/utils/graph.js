export const createGraphNode = (node) => {
  let n = {
    data: {
      id: node.value,
      projectId: node.projectId,
      graph: node.graph,
      label: node.prefLabel.value.length > 15
        ? `${node.prefLabel.value.substring(0, 15)}...` : node.prefLabel.value,
      isCompound: isCompound(node)
    },
    classes: `${isCompound(node) ? "compound" : ""}`
  }
  if (node.depiction)
    n.data.depiction = `${node.depiction.value}?type=large`;

  if (isCompound(node)) {
    n.data.subj = node.subj;
    n.data.pred = node.pred;
  }
  if (node.parent) {
    n.data.parent = node.parent
  }
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
