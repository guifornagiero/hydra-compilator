export default class TreeNode {
    nome: string;
    nodes: TreeNode[];
    enter: string;
    exit: string;
  
    constructor(nome: string) {
      this.nome = nome;
      this.nodes = [];
      this.enter = ' ';
      this.exit = '';
    }
  
    addNode(newNode: TreeNode): void {
      this.nodes.push(newNode);
    }
  
    addNodeByName(nodeName: string): TreeNode {
      const newNode = new TreeNode(nodeName);
      this.nodes.push(newNode);
      return newNode;
    }
  
    addNodeWithDetails(enter: string, nodeName: string, exit: string): TreeNode {
      const newNode = new TreeNode(nodeName);
      newNode.enter = enter;
      newNode.exit = exit;
      this.nodes.push(newNode);
      return newNode;
    }
  
    toString(): string {
      return `${this.enter} ${this.nome} ${this.exit}`.trim();
    }
  
    getTree(): string {
      console.log("AST\n");
      const buffer: string[] = [];
      this.print(buffer, '', '');
      return buffer.join('');
    }
  
    private print(buffer: string[], prefix: string, childrenPrefix: string): void {
      buffer.push(prefix + this.nome + '\n');
      for (let i = 0; i < this.nodes.length; i++) {
        const next = this.nodes[i];
        if (i < this.nodes.length - 1) {
          next.print(buffer, childrenPrefix + '+-- ', childrenPrefix + '|   ');
        } else {
          next.print(buffer, childrenPrefix + '`-- ', childrenPrefix + '    ');
        }
      }
    }
  }
  