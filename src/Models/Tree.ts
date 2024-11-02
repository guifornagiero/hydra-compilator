import TreeNode from "./TreeNode";

export default class Tree {
    root: TreeNode | null;
  
    constructor(root?: TreeNode) {
      this.root = root || null;
    }
  
    setRoot(node: TreeNode): void {
      this.root = node;
    }
  
    preOrder(): void {
      if (this.root) {
        this.preOrderTraversal(this.root);
        console.log("");
      }
    }
  
    printCode(): void {
      if (this.root) {
        this.printCodeTraversal(this.root);
        console.log("");
      }
    }
  
    private preOrderTraversal(node: TreeNode): void {
      if (node) {
        process.stdout.write(node.toString());
        node.nodes.forEach(n => this.preOrderTraversal(n));
      }
    }
  
    private printCodeTraversal(node: TreeNode): void {
      if (node) {
        process.stdout.write(node.enter);
        if (node.nodes.length === 0) {
          process.stdout.write(node.toString());
        }
        node.nodes.forEach(n => this.printCodeTraversal(n));
        process.stdout.write(node.exit);
      }
    }
  
    printTree(): void {
      if (this.root) {
        console.log(this.root.getTree());
      }
    }
  }
  