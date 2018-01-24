import BinarySearchTree from '../classes/BinarySearchTree';

export const INIT_BINARY_SEARCH_TREE = 'INIT_BINARY_SEARCH_TREE';
export const INSERT_BINARY_SEARCH_TREE_NODE = 'INSERT_BINARY_SEARCH_TREE_NODE';
export const INGORE = 'IGNORE';
export const REMOVE_BINARY_SEARCH_TREE_NODE = 'REMOVE_BINARY_SEARCH_TREE_NODE';
export const REPLACE_BINARY_SEARCH_TREE = 'REPLACE_BINARY_SEARCH_TREE';

export const initBinarySearchTree = () => {
  const tree = new BinarySearchTree();
  return {
    type: INIT_BINARY_SEARCH_TREE,
    payload: {
      tree
    }
  };
};

export const insertBinarySearchTreeNode = (data, tree) => {
  var type = INSERT_BINARY_SEARCH_TREE_NODE;
  const newTree = tree.clone();
  const insertResult = newTree.insert(data);
  // avoid rendering on failed insert due to duplicate value
  if (insertResult === false) {
    type = INGORE;
  }

  return {
    type,
    payload: {
      tree: newTree
    }
  };
};

export const removeBinarySearchTreeNode = (data, tree) => {
  const newTree = tree.clone();
  newTree.remove(data);

  return {
    type: REMOVE_BINARY_SEARCH_TREE_NODE,
    payload: {
      tree: newTree
    }
  };
};

export const replaceBinarySearchTree = (tree, container) => {
  const newTree = tree.clone();

  return {
    type: REPLACE_BINARY_SEARCH_TREE,
    payload: {
      tree: newTree,
      container
    }
  };
};