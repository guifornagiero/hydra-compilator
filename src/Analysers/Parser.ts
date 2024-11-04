import { Token } from "../Models/Token";
import Tree from "../Models/Tree";
import TreeNode from "../Models/TreeNode";
import fs from "fs";
import Semantic from "./Semantic";

export default class Parser {
    private tokens: Token[];
    private token: Token | null;

    private HEADER: string = "import java.util.Scanner; \npublic class Main { \npublic static void main(String[] args) {\n";
    private FOOTER: string = "\n}\n}\n";

    private semantic: Semantic;
    lastId: string = "";
    lastType: string = "";
    currentOperation: string = "";

    private finalCode: string = "";

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.token = this.getNextToken();
        this.semantic = new Semantic();
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
                this.semantic.printVariables();
                this.createTranslatedFile();
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
        } else if (this.token?.tipo === "ID") {
            if (this.REDECLARACAO(bloco) && this.BLOCO(bloco)) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("BLOCO");
        return false;
    }

    private REDECLARACAO(node: TreeNode): boolean {
        const redeclaracao = node.addNodeByName("REDECLARACAO");
        this.currentOperation = "REDECLARACAO";

        if (
            this.id(redeclaracao) &&
            this.declarationArrow(redeclaracao) &&
            this.EXPRESSION(redeclaracao) &&
            this.semi(redeclaracao)
        ) {
            this.semantic.redeclareVariable(this.lastId, () => {
                this.lastId = "";
                this.lastType = "";
            });

            return true;
        }

        this.erro("REDECLARACAO");
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
        this.currentOperation = "IF";

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
        this.currentOperation = "ELSE_IF";

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
        this.currentOperation = "ELSE";

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
        this.currentOperation = "FOR";

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
        this.currentOperation = "WHILE";

        if (
            this.while(whileNode) &&
            this.openPar(whileNode) &&
            this.W(whileNode) &&
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

    private W(node: TreeNode): boolean {
        const w = node.addNodeByName("W");

        if (this.token?.lexema === "true" || this.token?.lexema === "false") {
            if (this.trueOrFalse(w))
                return true;
        } else if (this.CONDICAO(w)) {
            return true;
        }

        this.erro("W");
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
        this.currentOperation = "DECLARACAO";

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
        this.currentOperation = "DECLARACAO";

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
            this.semantic.declareVariable(this.lastId, this.lastType, () => {
                this.lastId = "";
                this.lastType = "";
            });

            return true;
        }

        this.erro("DECLARACAO");
        return false;
    }

    private TIPO(node: TreeNode): boolean {
        const tipo = node.addNodeByName("TIPO");
        const tipoName = this.token?.lexema;

        if (
            this.matchType("INTEGER", tipo) ||
            this.matchType("STRING", tipo, "String") ||
            this.matchType("DECIMAL", tipo, "float") ||
            this.matchType("BOOLEAN", tipo, "boolean")
        ) {
            this.lastType = tipoName!;
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
        const trueOrFalse = node.addNodeByName("trueOrFalse");

        if (this.matchLexem("true", trueOrFalse) || this.matchType("false", trueOrFalse))
            return true;

        this.erro("trueOrFalse");
        return false;
    }

    private or(node: TreeNode): boolean {
        if (this.matchLexem("|", node, ";"))
            return true;

        this.erro("or");
        return false;
    }

    private operadorRelacional(node: TreeNode): boolean {
        const operadorRelacional = node.addNodeByName("operadorRelacional");

        if (
            this.matchLexem(">=", operadorRelacional) ||
            this.matchLexem("<=", operadorRelacional) ||
            this.matchLexem("=", operadorRelacional, "==") ||
            this.matchLexem("<", operadorRelacional) ||
            this.matchLexem(">", operadorRelacional)
        )
            return true;

        this.erro("operadorRelacional");
        return false;
    }

    private while(node: TreeNode): boolean {
        if (this.matchLexem("@w", node, "while"))
            return true;

        this.erro("while");
        return false;
    }

    private elseif(node: TreeNode): boolean {
        if (this.matchLexem("@ei", node, "else if"))
            return true;

        this.erro("elseif");
        return false;
    }

    private else(node: TreeNode): boolean {
        if (this.matchLexem("@e", node, "else"))
            return true;

        this.erro("else");
        return false;
    }

    private comment(node: TreeNode): boolean {
        if (this.matchType("COMMENT", node, ""))
            return true;

        this.erro("comment");
        return false;
    }

    private string(node: TreeNode): boolean {
        const stringNode = node.addNodeByName("string");

        if (this.matchType("LITERAL_STRING", stringNode))
            return true;

        this.erro("string");
        return false;
    }

    private print(node: TreeNode): boolean {
        if (this.matchLexem("@p", node, "System.out.print"))
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
        const num = node.addNodeByName("num");

        if (this.matchType("NUM", num))
            return true;

        this.erro("num");
        return false;
    }

    private dec(node: TreeNode): boolean {
        const dec = node.addNodeByName("dec");

        if (this.matchType("DEC", dec))
            return true;

        this.erro("dec");
        return false;
    }

    private var(node: TreeNode): boolean {
        if (this.matchLexem("var", node, ""))
            return true;

        this.erro("var");
        return false;
    }

    private lessThen(node: TreeNode): boolean {
        if (this.matchLexem("<", node, ""))
            return true;

        this.erro("lessThen");
        return false;
    }

    private greaterThen(node: TreeNode): boolean {
        if (this.matchLexem(">", node, " "))
            return true;

        this.erro("greaterThen");
        return false;
    }

    private id(node: TreeNode): boolean {
        const id = node.addNodeByName("id");
        const idName = this.token?.lexema;
        
        if (this.matchType("ID", id)) {
            if (this.currentOperation !== "DECLARACAO")
                this.semantic.variableExists(idName!);

            this.lastId = idName!;
            return true;
        }

        this.erro("id");
        return false;
    }

    private declarationArrow(node: TreeNode): boolean {
        if (this.matchLexem("->", node, "="))
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

    private openPar(node: TreeNode): boolean {
        if (this.matchLexem("(", node))
            return true;

        this.erro("openPar");
        return false;
    }

    private closePar(node: TreeNode): boolean {
        if (this.matchLexem(")", node))
            return true;

        this.erro("closePar");
        return false;
    }

    private scopeArrow(node: TreeNode): boolean {
        if (this.matchLexem(">->", node, ""))
            return true;

        this.erro("scopeArrow");
        return false;
    }

    private openBracket(node: TreeNode): boolean {
        if (this.matchLexem("{", node))
            return true;

        this.erro("openBracket");
        return false;
    }

    private closeBracket(node: TreeNode): boolean {
        if (this.matchLexem("}", node))
            return true;

        this.erro("closeBracket");
        return false;
    }

    private if(node: TreeNode): boolean {
        if (this.matchLexem("@i", node, "if"))
            return true;

        this.erro("if");
        return false;
    }

    private for(node: TreeNode): boolean {
        if (this.matchLexem("@f", node, "for"))
            return true;

        this.erro("for");
        return false;
    }

    private up(node: TreeNode): boolean {
        if (this.matchLexem("up", node, "++"))
            return true;

        this.erro("up");
        return false;
    }

    private from(node: TreeNode): boolean {
        if (this.matchLexem("from", node, ""))
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

        if (this.matchLexem("begin", begin, this.HEADER) && this.matchLexem(";", begin, ""))
            return true;

        this.erro("begin");
        return false;
    }

    private END(node: TreeNode): boolean {
        const end = node.addNodeByName("END");

        if (this.matchLexem("end", end, this.FOOTER) && this.matchLexem(";", end, ""))
            return true;

        this.erro("end");
        return false;
    }
    //#endregion

    private matchType(type: string, node: TreeNode, newCode?: string): boolean {
        if (this.token?.tipo === type) {
            node.addNodeByName(this.token?.lexema);
            this.translate(newCode == undefined ? this.token.lexema : newCode);
            
            this.token = this.getNextToken();
            return true;
        }

        node.addNodeByName("EXPECTED: " + type + " - RECEIVED: " + this.token?.tipo);
        return false;
    }

    private matchLexem(lexem: string, node: TreeNode, newCode?: string): boolean {
        if (this.token?.lexema === lexem) {
            node.addNodeByName(this.token?.lexema);
            this.translate(newCode == undefined ? lexem : newCode);

            this.token = this.getNextToken();
            return true;
        }

        node.addNodeByName("EXPECTED: " + lexem + " - RECEIVED: " + this.token?.lexema);
        return false;
    }

    private translate(code: string): void {
        this.finalCode += code;
    }

    private createTranslatedFile(): void {
        if (!fs.existsSync("./output"))
            fs.mkdirSync("./output");
        
        fs.writeFileSync("./output/Main.java", this.finalCode);
    }
}