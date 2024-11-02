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
        } else if (this.token?.tipo === "COMMENT"){
            if (this.COMENTARIO() && this.BLOCO()){
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
        if (this.matchType("LITERAL_STRING") || this.E()) {
            return true;
        }

        this.erro("P");
        return false;
    }

    private COMENTARIO(): boolean {
        if (this.comment()) {
            return true;
        }

        this.erro("COMENTARIO");
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
        if (this.token?.tipo === "READ_FUNCTION") {
            if (this.READ_FUNCTION()) {
                return true;
            }
        } else if (this.token?.tipo === "LITERAL_STRING") {
            if (this.string()) {
                return true;
            }
        } else if (this.token?.tipo === "TRUE" || this.token?.tipo === "FALSE") {
            if (this.trueOrFalse()) {
                return true;
            }
        } else if (this.E()) {
            return true;
        }

        this.erro("EXPRESSION");
        return false;
    }

    private READ_FUNCTION(): boolean {
        if (this.read() && this.openPar() && this.string() && this.closePar()) {
            return true;
        }

        this.erro("R");
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
            if (this.id())
                return true;
        } else if (this.token?.tipo === "DEC") {
            if (this.dec())
                return true;
        } else if (this.token?.tipo === "NUM") {
            if (this.num())
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
    private trueOrFalse(): boolean {
        if (this.matchLexem("true") || this.matchType("false"))
            return true;

        this.erro("trueOrFalse");
        return false;
    }

    private or(): boolean {
        if (this.matchLexem("|"))
            return true;

        this.erro("or");
        return false;
    }

    private operadorRelacional(): boolean {
        if (
            this.matchLexem(">=") ||
            this.matchLexem("<=") ||
            this.matchLexem("=") ||
            this.matchLexem("<") ||
            this.matchLexem(">")
        )
            return true;

        this.erro("operadorRelacional");
        return false;
    }

    private while(): boolean {
        if (this.matchLexem("@w"))
            return true;

        this.erro("while");
        return false;
    }

    private elseif(): boolean {
        if (this.matchLexem("@ei"))
            return true;

        this.erro("elseif");
        return false;
    }

    private else(): boolean {
        if (this.matchLexem("@e"))
            return true;

        this.erro("else");
        return false;
    }

    private comment(): boolean {
        if (this.matchType("COMMENT"))
            return true;

        this.erro("comment");
        return false;
    }

    private string(): boolean {
        if (this.matchType("LITERAL_STRING"))
            return true;

        this.erro("string");
        return false;
    }

    private print(): boolean {
        if (this.matchLexem("@p"))
            return true;

        this.erro("print");
        return false;
    }

    private read(): boolean {
        if (this.matchLexem("@r"))
            return true;

        this.erro("read");
        return false;
    }

    private num(): boolean {
        if (this.matchType("NUM"))
            return true;

        this.erro("num");
        return false;
    }

    private dec(): boolean {
        if (this.matchType("DEC"))
            return true;

        this.erro("dec");
        return false;
    }

    private var(): boolean {
        if (this.matchLexem("var"))
            return true;

        this.erro("var");
        return false;
    }

    private lessThen(): boolean {
        if (this.matchLexem("<"))
            return true;

        this.erro("lessThen");
        return false;
    }

    private greaterThen(): boolean {
        if (this.matchLexem(">"))
            return true;

        this.erro("greaterThen");
        return false;
    }

    private id(): boolean {
        if (this.matchType("ID"))
            return true;

        this.erro("id");
        return false;
    }

    private declarationArrow(): boolean {
        if (this.matchLexem("->"))
            return true;

        this.erro("declarationArrow");
        return false;
    }

    private semi(): boolean {
        if (this.matchLexem(";"))
            return true;

        this.erro("semi");
        return false;
    }

    private openPar(): boolean {
        if (this.matchLexem("("))
            return true;

        this.erro("openPar");
        return false;
    }

    private closePar(): boolean {
        if (this.matchLexem(")"))
            return true;

        this.erro("closePar");
        return false;
    }

    private scopeArrow(): boolean {
        if (this.matchLexem(">->"))
            return true;

        this.erro("scopeArrow");
        return false;
    }

    private openBracket(): boolean {
        if (this.matchLexem("{"))
            return true;

        this.erro("openBracket");
        return false;
    }

    private closeBracket(): boolean {
        if (this.matchLexem("}"))
            return true;

        this.erro("closeBracket");
        return false;
    }

    private if(): boolean {
        if (this.matchLexem("@i"))
            return true;

        this.erro("if");
        return false;
    }

    private for(): boolean {
        if (this.matchLexem("@f"))
            return true;

        this.erro("for");
        return false;
    }

    private up(): boolean {
        if (this.matchLexem("up"))
            return true;

        this.erro("up");
        return false;
    }

    private from(): boolean {
        if (this.matchLexem("from"))
            return true;

        this.erro("from");
        return false;
    }

    private to(): boolean {
        if (this.matchLexem("to"))
            return true;

        this.erro("to");
        return false;
    }

    private begin(): boolean {
        if (this.matchLexem("begin") && this.matchLexem(";"))
            return true;

        this.erro("begin");
        return false;
    }

    private end(): boolean {
        if (this.matchLexem("end") && this.matchLexem(";"))
            return true;

        this.erro("end");
        return false;
    }
    //#endregion

    private matchType(type: string): boolean {
        if (this.token?.tipo === type) {
            this.token = this.getNextToken();
            return true;
        }

        return false;
    }

    private matchLexem(lexem: string): boolean {
        if (this.token?.lexema === lexem) {
            this.token = this.getNextToken();
            return true;
        }

        return false;
    }
}