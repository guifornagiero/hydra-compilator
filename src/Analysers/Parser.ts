import { Token } from "../Models/Token";

export default class Parser {
    private tokens: Token[];
    private token: Token | null;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.token = this.getNextToken();
    }

    public parse(): void {
        if (this.PROGRAMA()) {
            console.log("Código válido!");
        } else {
            console.log("Código inválido!");
        }
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
    private PROGRAMA(): boolean {
        if (this.begin() && this.BLOCO() && this.end()) {
            if (this.token?.tipo === "EOF") {
                return true;
            }
        }

        this.erro("PROGRAMA");
        return false;
    }

    private BLOCO(): boolean {
        if (this.token?.tipo === "IF") {
            if (this.IF() && this.BLOCO()) {
                return true;
            }
        } else if (this.token?.tipo === "FOR") {
            if (this.FOR() && this.BLOCO()) {
                return true;
            }
        } else if (this.token?.tipo === "WHILE") {
            if (this.WHILE() && this.BLOCO()) {
                return true;
            }
        } else if (this.token?.tipo === "VAR") {
            if (this.DECLARACAO() && this.BLOCO()) {
                return true;
            }
        } else if (this.token?.tipo === "PRINT_FUNCTION") {
            if (this.PRINT() && this.BLOCO()) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("BLOCO");
        return false;
    }

    private PRINT(): boolean {
        if (
            this.print() &&
            this.openPar() &&
            this.P() &&
            this.closePar() &&
            this.semi()
        ) {
            return true;
        }

        this.erro("PRINT");
        return false;
    }

    private P(): boolean {
        if (this.string() || this.E()) {
            return true;
        }

        this.erro("P");
        return false;
    }

    private string(): boolean {
        if (this.token?.tipo === "LITERAL_STRING") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("string");
        return false;
    }

    private print(): boolean {
        if (this.token?.lexema === "@p") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("print");
        return false;
    }

    private IF(): boolean {
        if (
            this.if() &&
            this.openPar() &&
            this.CONDICAO() &&
            this.closePar() &&
            this.scopeArrow() &&
            this.openBracket() &&
            this.BLOCO() &&
            this.closeBracket() &&
            this.X()
        ) {
            return true;
        }

        this.erro("IF");
        return false;
    }

    private X(): boolean {
        if (this.token?.lexema === "@ei") {
            if (this.ELSE_IF() && this.X()) {
                return true;
            }
        } else if (this.token?.lexema === "@e") {
            if (this.ELSE()) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("X");
        return false;
    }

    private ELSE_IF(): boolean {
        if (
            this.elseif() &&
            this.openPar() &&
            this.CONDICAO() &&
            this.closePar() &&
            this.scopeArrow() &&
            this.openBracket() &&
            this.BLOCO() &&
            this.closeBracket()
        ) {
            return true;
        }

        this.erro("ELSE_IF");
        return false;
    }

    private elseif(): boolean {
        if (this.token?.lexema === "@ei") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("elseif");
        return false;
    }

    private else(): boolean {
        if (this.token?.lexema === "@e") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("else");
        return false;
    }

    private ELSE(): boolean {
        if (
            this.else() &&
            this.scopeArrow() &&
            this.openBracket() &&
            this.BLOCO() &&
            this.closeBracket()
        ) {
            return true;
        }

        this.erro("ELSE_IF");
        return false;
    }

    private FOR(): boolean {
        if (
            this.for() &&
            this.openPar() &&
            this.FOR_CONDICAO() &&
            this.closePar() &&
            this.scopeArrow() &&
            this.openBracket() &&
            this.BLOCO() &&
            this.closeBracket()
        ) {
            return true;
        }

        this.erro("WHILE");
        return false;
    }

    private WHILE(): boolean {
        if (
            this.while() &&
            this.openPar() &&
            this.CONDICAO() &&
            this.closePar() &&
            this.scopeArrow() &&
            this.openBracket() &&
            this.BLOCO() &&
            this.closeBracket()
        ) {
            return true;
        }

        this.erro("WHILE");
        return false;
    }

    private CONDICAO(): boolean {
        if (this.E() && this.operadorRelacional() && this.E()) {
            return true;
        }

        this.erro("CONDICAO");
        return false;
    }

    private FOR_CONDICAO(): boolean {
        if (
            this.var() &&
            this.lessThen() &&
            this.TIPO() &&
            this.greaterThen() &&
            this.id() &&
            this.declarationArrow() &&
            this.E() &&
            this.or() &&
            this.from() &&
            this.id() &&
            this.to() &&
            this.E() &&
            this.or() &&
            this.up() &&
            this.id()
        ) {
            return true;
        }

        this.erro("FOR_CONDICAO");
        return false;
    }

    private or(): boolean {
        if (this.token?.tipo === "OR") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("or");
        return false;
    }

    private operadorRelacional(): boolean {
        if (
            this.token?.lexema === ">" ||
            this.token?.lexema === "<" ||
            this.token?.lexema === ">=" ||
            this.token?.lexema === "<=" ||
            this.token?.lexema === "="
        ) {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("operadorRelacional");
        return false;
    }

    private while(): boolean {
        if (this.token?.tipo === "WHILE") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("while");
        return false;
    }

    private DECLARACAO(): boolean {
        if (
            this.var() &&
            this.lessThen() &&
            this.TIPO() &&
            this.greaterThen() &&
            this.id() &&
            this.declarationArrow() &&
            this.EXPRESSION() &&
            this.semi()
        ) {
            return true;
        }

        this.erro("DECLARACAO");
        return false;
    }

    private TIPO(): boolean {
        if (
            this.token?.tipo === "INTEGER" ||
            this.token?.tipo === "STRING" ||
            this.token?.tipo === "DECIMAL" ||
            this.token?.tipo === "BOOLEAN"
        ) {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("TIPO");
        return false;
    }

    private EXPRESSION(): boolean {
        if (this.token?.tipo === "LITERAL_STRING") {
            this.token = this.getNextToken();
            return true;
        } else if (
            this.token?.tipo === "TRUE" ||
            this.token?.tipo === "FALSE"
        ) {
            this.token = this.getNextToken();
            return true;
        } else if (this.E()) {
            return true;
        }

        this.erro("EXPRESSION");
        return false;
    }

    private E(): boolean {
        if (this.T() && this.E_()) {
            return true;
        }

        this.erro("E");
        return false;
    }

    private E_(): boolean {
        if (this.token?.lexema === "+") {
            this.token = this.getNextToken();
            if (this.T() && this.E_()) {
                return true;
            }
        } else if (this.token?.lexema === "-") {
            this.token = this.getNextToken();
            if (this.T() && this.E_()) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("E_");
        return false;
    }

    private T(): boolean {
        if (this.F() && this.T_()) {
            return true;
        }

        this.erro("T");
        return false;
    }

    private T_(): boolean {
        if (this.token?.lexema === "*") {
            this.token = this.getNextToken();
            if (this.F() && this.T_()) {
                return true;
            }
        } else if (this.token?.lexema === "/") {
            this.token = this.getNextToken();
            if (this.F() && this.T_()) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("T_");
        return false;
    }

    private F(): boolean {
        if (this.token?.tipo === "ID") {
            this.token = this.getNextToken();
            return true;
        } else if (this.token?.tipo === "DEC") {
            this.token = this.getNextToken();
            return true;
        } else if (this.token?.tipo === "NUM") {
            this.token = this.getNextToken();
            return true;
        } else if (this.token?.lexema === "(") {
            this.token = this.getNextToken();
            if (this.E() && this.token?.lexema === ")") {
                this.token = this.getNextToken();
                return true;
            }
        }

        this.erro("F");
        return false;
    }

    //#endregion

    //#region Terminais
    private var(): boolean {
        if (this.token?.lexema === "var") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("var");
        return false;
    }

    private lessThen(): boolean {
        if (this.token?.lexema === "<") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("<");
        return false;
    }

    private greaterThen(): boolean {
        if (this.token?.lexema === ">") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro(">");
        return false;
    }

    private id(): boolean {
        if (this.token?.tipo === "ID") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("id");
        return false;
    }

    private declarationArrow(): boolean {
        if (this.token?.lexema === "->") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro("->");
        return false;
    }

    private semi(): boolean {
        if (this.token?.lexema === ";") {
            this.token = this.getNextToken();
            return true;
        }

        // this.erro(";");
        return false;
    }

    private openPar(): boolean {
        if (this.token?.lexema === "(") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("(");
        return false;
    }

    private closePar(): boolean {
        if (this.token?.lexema === ")") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro(")");
        return false;
    }

    private scopeArrow(): boolean {
        if (this.token?.lexema === ">->") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro(">->");
        return false;
    }

    private openBracket(): boolean {
        if (this.token?.lexema === "{") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("{");
        return false;
    }

    private closeBracket(): boolean {
        if (this.token?.lexema === "}") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("}");
        return false;
    }

    private if(): boolean {
        if (this.token?.tipo === "IF") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("if");
        return false;
    }

    private for(): boolean {
        if (this.token?.tipo === "FOR") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("for");
        return false;
    }

    private up(): boolean {
        if (this.token?.tipo === "UP") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("up");
        return false;
    }

    private from(): boolean {
        if (this.token?.tipo === "FROM") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("from");
        return false;
    }

    private to(): boolean {
        if (this.token?.tipo === "TO") {
            this.token = this.getNextToken();
            return true;
        }
        // this.erro("to");
        return false;
    }

    private begin(): boolean {
        if (this.token?.lexema === "begin") {
            this.token = this.getNextToken();
            if (this.token?.lexema === ";") {
                this.token = this.getNextToken();
                return true;
            }
        }

        // this.erro("begin");
        return false;
    }

    private end(): boolean {
        if (this.token?.lexema === "end") {
            this.token = this.getNextToken();
            if (this.token?.lexema === ";") {
                this.token = this.getNextToken();
                return true;
            }
        }

        // this.erro("end");
        return false;
    }
    //#endregion
}