export const VISUAL_GRAPH_NODE_ADDED = 'VISUAL_GRAPH/NODE_ADDED';
export const VISUAL_GRAPH_EDGES_ADDED = 'VISUAL_GRAPH/EDGES_ADDED';
export const VISUAL_GRAPH_NODE_REMOVED = 'VISUAL_GRAPH/NODE_REMOVED';
export const VISUAL_GRAPH_CLOSE_NODE_INFO_DRAWER = 'VISUAL_GRAPH/CLOSE_NODE_INFO_DRAWER';
export const VISUAL_GRAPH_OPEN_NODE_INFO_DRAWER = 'VISUAL_GRAPH/OPEN_NODE_INFO_DRAWER';

export const visualGraphActions = {
    addNode,
    removeNode,
    addEdges,
    closeNodeInfoDrawer,
    openNodeInfoDrawer
}

function closeNodeInfoDrawer() {
    return dispatch => dispatch({
        type: VISUAL_GRAPH_CLOSE_NODE_INFO_DRAWER
    })
}

function openNodeInfoDrawer(node) {
    return dispatch => dispatch({
        type: VISUAL_GRAPH_OPEN_NODE_INFO_DRAWER,
        node
    })
}

function removeNode(uri) {
    return dispatch => dispatch({
        type: VISUAL_GRAPH_NODE_REMOVED,
        uri
    })
}

function addNode(node) {
    return dispatch => dispatch({
        type: VISUAL_GRAPH_NODE_ADDED,
        node
    })
}

function addEdges(edges) {
    return dispatch => dispatch({
        type: VISUAL_GRAPH_EDGES_ADDED,
        edges
    })
}

