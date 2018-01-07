export default class BinaryTreeNode {
  constructor(data) {
    // typical node schema
    this.data = data;
    this.left = null;
    this.right = null;
  }

  setLeft(node) {
    this.left = node;
  }

  setRight(node) {
    this.right = node;
  }
}