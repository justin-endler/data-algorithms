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

  clone() {
    var newNode = new BinaryTreeNode(this.data);
    if (this.left) {
      newNode.left = this.left.clone();
    }
    if (this.right) {
      newNode.right = this.right.clone();
    }

    return newNode;
  }
}