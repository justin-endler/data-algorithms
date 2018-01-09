import * as actionTypes from '../actions';

const TreeReducer = (state, action) => {
  state = state || {
    d3Representation: []
  };

  // ignore irrelevant actions
  if (!actionTypes[action.type]) {
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