import { Token } from "../Models/Token";
import Tree from "../Models/Tree";
import TreeNode from "../Models/TreeNode";

export default class Parser {
    private tokens: Token[];
    private token: Token | null;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.token = this.getNextToken();
    }

    public parse(): Tree {
        const program = new TreeNode("PROGRAMA");
        const tree = new Tree(program);

        if (this.PROGRAMA(program)) {
            console.log("Código válido!\n");
        } else {
            console.log("Código inválido!");
        }

        return tree;
    }

    private getNextToken(): Token | null {
        // if (!!this.token) console.log(this.token);
        if (this.tokens.length > 0) return this.tokens.shift() || null;
        return null;
    }

    private erro(regra: string): void {
        console.error("Erro na compilação!");
        throw new Error(`Erro na regra ${regra} - Token atual: ${this.token?.lexema}`);
    }

    //#region Regras
    private PROGRAMA(node: TreeNode): boolean {
        if (this.BEGIN(node) && this.BLOCO(node) && this.END(node)) {
            if (this.token?.tipo === "EOF") {
                return true;
            }
        }

        this.erro("PROGRAMA");
        return false;
    }

    private BLOCO(node: TreeNode): boolean {
        const bloco = node.addNodeByName("BLOCO");

        if (this.token?.tipo === "IF") {
            if (this.IF(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else if (this.token?.tipo === "FOR") {
            if (this.FOR(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else if (this.token?.tipo === "WHILE") {
            if (this.WHILE(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else if (this.token?.tipo === "VAR") {
            if (this.DECLARACAO(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else if (this.token?.tipo === "PRINT_FUNCTION") {
            if (this.PRINT(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else if (this.token?.tipo === "COMMENT"){
            if (this.COMENTARIO(bloco) && this.BLOCO(bloco)){
                return true;
            }
        } else {
            return true;
        }

        this.erro("BLOCO");
        return false;
    }

    private PRINT(node: TreeNode): boolean {
        const print = node.addNodeByName("PRINT");

        if (
            this.print(print) &&
            this.openPar(print) &&
            this.P(print) &&
            this.closePar(print) &&
            this.semi(print)
        ) {
            return true;
        }

        this.erro("PRINT");
        return false;
    }

    private P(node: TreeNode): boolean {
        const p = node.addNodeByName("P");

        if (this.matchType("LITERAL_STRING", p) || this.E(p)) {
            return true;
        }

        this.erro("P");
        return false;
    }

    private COMENTARIO(node: TreeNode): boolean {
        const comentario = node.addNodeByName("COMENTARIO");

        if (this.comment(comentario)) {
            return true;
        }

        this.erro("COMENTARIO");
        return false;
    }

    private IF(node: TreeNode): boolean {
        const ifNode = node.addNodeByName("IF");

        if (
            this.if(ifNode) &&
            this.openPar(ifNode) &&
            this.CONDICAO(ifNode) &&
            this.closePar(ifNode) &&
            this.scopeArrow(ifNode) &&
            this.openBracket(ifNode) &&
            this.BLOCO(ifNode) &&
            this.closeBracket(ifNode) &&
            this.X(ifNode)
        ) {
            return true;
        }

        this.erro("IF");
        return false;
    }

    private X(node: TreeNode): boolean {
        const x = node.addNodeByName("X");

        if (this.token?.lexema === "@ei") {
            if (this.ELSE_IF(x) && this.X(x)) {
                return true;
            }
        } else if (this.token?.lexema === "@e") {
            if (this.ELSE(x)) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("X");
        return false;
    }

    private ELSE_IF(node: TreeNode): boolean {
        const elseIf = node.addNodeByName("ELSE_IF");

        if (
            this.elseif(elseIf) &&
            this.openPar(elseIf) &&
            this.CONDICAO(elseIf) &&
            this.closePar(elseIf) &&
            this.scopeArrow(elseIf) &&
            this.openBracket(elseIf) &&
            this.BLOCO(elseIf) &&
            this.closeBracket(elseIf)
        ) {
            return true;
        }

        this.erro("ELSE_IF");
        return false;
    }

    private ELSE(node: TreeNode): boolean {
        const elseNode = node.addNodeByName("ELSE");

        if (
            this.else(elseNode) &&
            this.scopeArrow(elseNode) &&
            this.openBracket(elseNode) &&
            this.BLOCO(elseNode) &&
            this.closeBracket(elseNode)
        ) {
            return true;
        }

        this.erro("ELSE_IF");
        return false;
    }

    private FOR(node: TreeNode): boolean {
        const forNode = node.addNodeByName("FOR");

        if (
            this.for(forNode) &&
            this.openPar(forNode) &&
            this.FOR_CONDICAO(forNode) &&
            this.closePar(forNode) &&
            this.scopeArrow(forNode) &&
            this.openBracket(forNode) &&
            this.BLOCO(forNode) &&
            this.closeBracket(forNode)
        ) {
            return true;
        }

        this.erro("WHILE");
        return false;
    }

    private WHILE(node: TreeNode): boolean {
        const whileNode = node.addNodeByName("WHILE");

        if (
            this.while(whileNode) &&
            this.openPar(whileNode) &&
            this.CONDICAO(whileNode) &&
            this.closePar(whileNode) &&
            this.scopeArrow(whileNode) &&
            this.openBracket(whileNode) &&
            this.BLOCO(whileNode) &&
            this.closeBracket(whileNode)
        ) {
            return true;
        }

        this.erro("WHILE");
        return false;
    }

    private CONDICAO(node: TreeNode): boolean {
        const condicao = node.addNodeByName("CONDICAO");

        if (this.E(condicao) && this.operadorRelacional(condicao) && this.E(condicao)) {
            return true;
        }

        this.erro("CONDICAO");
        return false;
    }

    private FOR_CONDICAO(node: TreeNode): boolean {
        const forCondicao = node.addNodeByName("FOR_CONDICAO");

        if (
            this.var(forCondicao) &&
            this.lessThen(forCondicao) &&
            this.TIPO(forCondicao) &&
            this.greaterThen(forCondicao) &&
            this.id(forCondicao) &&
            this.declarationArrow(forCondicao) &&
            this.E(forCondicao) &&
            this.or(forCondicao) &&
            this.from(forCondicao) &&
            this.id(forCondicao) &&
            this.to(forCondicao) &&
            this.E(forCondicao) &&
            this.or(forCondicao) &&
            this.up(forCondicao) &&
            this.id(forCondicao)
        ) {
            return true;
        }

        this.erro("FOR_CONDICAO");
        return false;
    }

    private DECLARACAO(node: TreeNode): boolean {
        const declaracao = node.addNodeByName("DECLARACAO");

        if (
            this.var(declaracao) &&
            this.lessThen(declaracao) &&
            this.TIPO(declaracao) &&
            this.greaterThen(declaracao) &&
            this.id(declaracao) &&
            this.declarationArrow(declaracao) &&
            this.EXPRESSION(declaracao) &&
            this.semi(declaracao)
        ) {
            return true;
        }

        this.erro("DECLARACAO");
        return false;
    }

    private TIPO(node: TreeNode): boolean {
        const tipo = node.addNodeByName("TIPO");

        if (
            this.matchType("INTEGER", tipo) ||
            this.matchType("STRING", tipo) ||
            this.matchType("DECIMAL", tipo) ||
            this.matchType("BOOLEAN", tipo)
        ) {
            return true;
        }

        this.erro("TIPO");
        return false;
    }

    private EXPRESSION(node: TreeNode): boolean {
        const expression = node.addNodeByName("EXPRESSION");

        if (this.token?.tipo === "READ_FUNCTION") {
            if (this.READ_FUNCTION(expression)) {
                return true;
            }
        } else if (this.token?.tipo === "LITERAL_STRING") {
            if (this.string(expression)) {
                return true;
            }
        } else if (this.token?.tipo === "TRUE" || this.token?.tipo === "FALSE") {
            if (this.trueOrFalse(expression)) {
                return true;
            }
        } else if (this.E(expression)) {
            return true;
        }

        this.erro("EXPRESSION");
        return false;
    }

    private READ_FUNCTION(node: TreeNode): boolean {
        const readFunction = node.addNodeByName("READ_FUNCTION");

        if (
            this.read(readFunction) &&
            this.openPar(readFunction) &&
            this.string(readFunction) &&
            this.closePar(readFunction)
        ) {
            return true;
        }

        this.erro("R");
        return false;
    }

    private E(node: TreeNode): boolean {
        const e = node.addNodeByName("E");

        if (this.T(e) && this.E_(e)) {
            return true;
        }

        this.erro("E");
        return false;
    }

    private E_(node: TreeNode): boolean {
        const e_ = node.addNodeByName("E_");

        if (this.token?.lexema === "+") {
            if (this.matchLexem("+", e_) && this.T(e_) && this.E_(e_)) {
                return true;
            }
        } else if (this.token?.lexema === "-") {
            if (this.matchLexem("-", e_) && this.T(e_) && this.E_(e_)) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("E_");
        return false;
    }

    private T(node: TreeNode): boolean {
        const t = node.addNodeByName("T");

        if (this.F(t) && this.T_(t)) {
            return true;
        }

        this.erro("T");
        return false;
    }

    private T_(node: TreeNode): boolean {
        const t_ = node.addNodeByName("T_");

        if (this.token?.lexema === "*") {
            if (this.matchLexem("*", t_) && this.F(t_) && this.T_(t_)) {
                return true;
            }
        } else if (this.token?.lexema === "/") {
            if (this.matchLexem("/", t_) && this.F(t_) && this.T_(t_)) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("T_");
        return false;
    }

    private F(node: TreeNode): boolean {
        const f = node.addNodeByName("F");

        if (this.token?.tipo === "ID") {
            if (this.id(f))
                return true;
        } else if (this.token?.tipo === "DEC") {
            if (this.dec(f))
                return true;
        } else if (this.token?.tipo === "NUM") {
            if (this.num(f))
                return true;
        } else if (this.token?.lexema === "(") {
            if (this.matchLexem("(", f) && this.E(f) && this.matchLexem(")", f)) {
                return true;
            }
        }

        this.erro("F");
        return false;
    }

    //#endregion

    //#region Terminais
    private trueOrFalse(node: TreeNode): boolean {
        if (this.matchLexem("true", node) || this.matchType("false", node))
            return true;

        this.erro("trueOrFalse");
        return false;
    }

    private or(node: TreeNode): boolean {
        if (this.matchLexem("|", node))
            return true;

        this.erro("or");
        return false;
    }

    private operadorRelacional(node: TreeNode): boolean {
        if (
            this.matchLexem(">=", node) ||
            this.matchLexem("<=", node) ||
            this.matchLexem("=", node) ||
            this.matchLexem("<", node) ||
            this.matchLexem(">", node)
        )
            return true;

        this.erro("operadorRelacional");
        return false;
    }

    private while(node: TreeNode): boolean {
        if (this.matchLexem("@w", node))
            return true;

        this.erro("while");
        return false;
    }

    private elseif(node: TreeNode): boolean {
        if (this.matchLexem("@ei", node))
            return true;

        this.erro("elseif");
        return false;
    }

    private else(node: TreeNode): boolean {
        if (this.matchLexem("@e", node))
            return true;

        this.erro("else");
        return false;
    }

    private comment(node: TreeNode): boolean {
        if (this.matchType("COMMENT", node))
            return true;

        this.erro("comment");
        return false;
    }

    private string(node: TreeNode): boolean {
        if (this.matchType("LITERAL_STRING", node))
            return true;

        this.erro("string");
        return false;
    }

    private print(node: TreeNode): boolean {
        if (this.matchLexem("@p", node))
            return true;

        this.erro("print");
        return false;
    }

    private read(node: TreeNode): boolean {
        if (this.matchLexem("@r", node))
            return true;

        this.erro("read");
        return false;
    }

    private num(node: TreeNode): boolean {
        if (this.matchType("NUM", node))
            return true;

        this.erro("num");
        return false;
    }

    private dec(node: TreeNode): boolean {
        if (this.matchType("DEC", node))
            return true;

        this.erro("dec");
        return false;
    }

    private var(node: TreeNode): boolean {
        if (this.matchLexem("var", node))
            return true;

        this.erro("var");
        return false;
    }

    private lessThen(node: TreeNode): boolean {
        if (this.matchLexem("<", node))
            return true;

        this.erro("lessThen");
        return false;
    }

    private greaterThen(node: TreeNode): boolean {
        if (this.matchLexem(">", node))
            return true;

        this.erro("greaterThen");
        return false;
    }

    private id(node: TreeNode): boolean {
        if (this.matchType("ID", node))
            return true;

        this.erro("id");
        return false;
    }

    private declarationArrow(node: TreeNode): boolean {
        if (this.matchLexem("->", node))
            return true;

        this.erro("declarationArrow");
        return false;
    }

    private semi(node: TreeNode): boolean {
        if (this.matchLexem(";", node))
            return true;

        this.erro("semi");
        return false;
    }

    private openPar(node?: TreeNode): boolean {
        if (this.matchLexem("(", node))
            return true;

        this.erro("openPar");
        return false;
    }

    private closePar(node?: TreeNode): boolean {
        if (this.matchLexem(")", node))
            return true;

        this.erro("closePar");
        return false;
    }

    private scopeArrow(node?: TreeNode): boolean {
        if (this.matchLexem(">->", node))
            return true;

        this.erro("scopeArrow");
        return false;
    }

    private openBracket(node?: TreeNode): boolean {
        if (this.matchLexem("{", node))
            return true;

        this.erro("openBracket");
        return false;
    }

    private closeBracket(node?: TreeNode): boolean {
        if (this.matchLexem("}", node))
            return true;

        this.erro("closeBracket");
        return false;
    }

    private if(node?: TreeNode): boolean {
        if (this.matchLexem("@i", node))
            return true;

        this.erro("if");
        return false;
    }

    private for(node: TreeNode): boolean {
        if (this.matchLexem("@f", node))
            return true;

        this.erro("for");
        return false;
    }

    private up(node: TreeNode): boolean {
        if (this.matchLexem("up", node))
            return true;

        this.erro("up");
        return false;
    }

    private from(node: TreeNode): boolean {
        if (this.matchLexem("from", node))
            return true;

        this.erro("from");
        return false;
    }

    private to(node: TreeNode): boolean {
        if (this.matchLexem("to", node))
            return true;

        this.erro("to");
        return false;
    }

    private BEGIN(node: TreeNode): boolean {
        const begin = node.addNodeByName("BEGIN");

        if (this.matchLexem("begin", begin) && this.matchLexem(";", begin))
            return true;

        this.erro("begin");
        return false;
    }

    private END(node: TreeNode): boolean {
        const end = node.addNodeByName("END");

        if (this.matchLexem("end", end) && this.matchLexem(";", end))
            return true;

        this.erro("end");
        return false;
    }
    //#endregion

    private matchType(type: string, node?: TreeNode): boolean {
        if (this.token?.tipo === type) {
            node?.addNodeByName(this.token?.lexema);
            
            this.token = this.getNextToken();
            return true;
        }

        node?.addNodeByName("EXPECTED: " + type + " - RECEIVED: " + this.token?.tipo);
        return false;
    }

    private matchLexem(lexem: string, node?: TreeNode): boolean {
        if (this.token?.lexema === lexem) {
            node?.addNodeByName(this.token?.lexema);

            this.token = this.getNextToken();
            return true;
        }

        node?.addNodeByName("EXPECTED: " + lexem + " - RECEIVED: " + this.token?.lexema);
        return false;
    }
}