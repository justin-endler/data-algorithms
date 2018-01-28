import {
  INIT_BINARY_SEARCH_TREE,
  INSERT_BINARY_SEARCH_TREE_NODE,
  REMOVE_BINARY_SEARCH_TREE_NODE,
  REPLACE_BINARY_SEARCH_TREE
} from '../actions';

const actionTypes = [
  INIT_BINARY_SEARCH_TREE,
  INSERT_BINARY_SEARCH_TREE_NODE,
  REMOVE_BINARY_SEARCH_TREE_NODE,
  REPLACE_BINARY_SEARCH_TREE
];

const TreeReducer = (state, action) => {
  state = state || {
    d3Representation: []
  };

  // Ignore irrelevant actions
  if (actionTypes.indexOf(action.type) === -1) {
    return state;
  }

  const { tree, container } = action.payload;

  return {
    tree,
    d3Representation: tree.getD3Representation(),
    translate: getBinaryTreeTranslate(container)
  };
};

const getBinaryTreeTranslate = (container) => {
  if (!container) {
    return;
  }

  var dimensions = container.getBoundingClientRect();
  return {
    x: dimensions.width / 2,
    y: 20
  };
};

export default TreeReducer;