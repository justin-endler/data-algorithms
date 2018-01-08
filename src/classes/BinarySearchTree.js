import BinaryTreeNode from './BinaryTreeNode';

export default class BinarySearchTree {
  constructor(root = null) {
    if (root) {
      root = root.clone();
    }

    this.root = root;
  }

  // typical BST api
  insert(data) {
    data = data && parseFloat(data);
    if (isNaN(data)) {
      return;
    }
    if (!this.root) {
      this.root = new BinaryTreeNode(data);
    } else {
      return this._searchAndLinkToNode(data, this.root);
    }
  }

  remove(data) {
    data = data && parseFloat(data);
    if (isNaN(data)) {
      return;
    }
    this.root = this._removeNode(this.root, data);
  }

  getLevelOrderTraversal(tree = this) {
    var result = [];
    var queue = [];

    if (!tree.root) {
      return result;
    }

    queue.push(tree.root);
    while(queue.length > 0) {
      let node = queue.shift();
      result.push(node.data);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    return result;
  }

  _searchAndLinkToNode(data, node) {
    if (data < node.data) {
      if (node.left) {
        return this._searchAndLinkToNode(data, node.left);
      }
      node.setLeft(new BinaryTreeNode(data));
    } else if (data > node.data) {
      if (node.right) {
        return this._searchAndLinkToNode(data, node.right);
      }
      node.setRight(new BinaryTreeNode(data));
    } else {
      return false;
    }
  }

  _removeNode(node, data) {
    if (!node) {
      return;
    }
    if (data === node.data) {
      // no children
      if (!(node.left || node.right)) {
        return;
      }
      // no left
      if (!node.left) {
        return node.right;
      }
      // no right
      if (!node.right) {
        return node.left;
      }
      // both
      var tempNode = node.right;
      while (tempNode.left) {
        tempNode = tempNode.left;
      }
      node.data = tempNode.data;
      node.right = this._removeNode(node.right, tempNode.data);
      return node;
    }
    if (data < node.data) {
      node.left = this._removeNode(node.left, data);
      return node;
    }
    node.right = this._removeNode(node.right, data);
    return node;
  }

  // helpers for use with React/Redux
  clone() {
    return new BinarySearchTree(this.root);
  }

  compare(binarySearchTree) {
    if (!(binarySearchTree && binarySearchTree.getLevelOrderTraversal)) {
      return false;
    }
    if (this.getLevelOrderTraversal().toString() === binarySearchTree.getLevelOrderTraversal().toString()) {
      return true;
    }
    return false;
  }

  // helpers for use with D3
  getD3Representation() {
    var result = [];
    if (!this.root) {
      return result;
    }
    result.push(this._collectInPreOrder(this.root));
    return result;
  }

  _collectInPreOrder(node) {
    var children = [];
    if (node.left) {
      children[0] = this._collectInPreOrder(node.left);
    } else {
      children[0] = {
        name: 'leaf'
      };
    }
    if (node.right) {
      children[1] = this._collectInPreOrder(node.right);
    } else {
      children[1] = {
        name: 'leaf'
      };
    }

    return {
      name: `${node.data}`,
      children
    };
  }
}