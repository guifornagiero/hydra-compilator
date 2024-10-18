import { Token } from "../Models/Token";

export class Parser {
    private tokens: Token[];
    private token: Token | null;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.token = this.getNextToken();
    }

    public getNextToken(): Token | null {
        if (!!this.token) console.log(this.token);
        if (this.tokens.length > 0) return this.tokens.shift() || null;
        return null;
    }

    public erro(regra: string): void {
        console.error("Erro na compilação!");
        throw new Error(
            `Erro na regra ${regra} - Token atual: ${this.token?.lexema}`
        );
    }

    public parse(): void {
        if (this.PROGRAMA()) {
            console.log("Código válido!");
        } else {
            console.log("Código inválido!");
        }
    }

    public PROGRAMA(): boolean {
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
                this.token = this.getNextToken();
                return true;
            }
        } else if (this.token?.tipo === "FOR") {
            if (this.FOR() && this.BLOCO()) {
                this.token = this.getNextToken();
                return true;
            }
        } else if (this.token?.tipo === "WHILE") {
            if (this.WHILE() && this.BLOCO()) {
                this.token = this.getNextToken();
                return true;
            }
        } else if (this.token?.tipo === "VAR") {
            if (this.DECLARACAO() && this.BLOCO()) {
                return true;
            }
        } else {
            return true;
        }

        this.erro("BLOCO");
        return false;
    }

    private IF(): boolean {
        return true;
    }

    private FOR(): boolean {
        return true;
    }

    private WHILE(): boolean {
        return true;
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

    private EXPRESSION(): boolean {
        if (this.token?.tipo === "NUM") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("EXPRESSION");
        return false;
    }

    private TIPO(): boolean {
        if (
            this.token?.tipo === "INTEGER" ||
            this.token?.tipo === "STRING" ||
            this.token?.tipo === "DECIMAL" ||
            this.token?.tipo === "TRUE" ||
            this.token?.tipo === "FALSE"
        ) {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("TIPO");
        return false;
    }

    private var(): boolean {
        if (this.token?.lexema === "var") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("var");
        return false;
    }

    private lessThen(): boolean {
        if (this.token?.lexema === "<") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("<");
        return false;
    }

    private greaterThen(): boolean {
        if (this.token?.lexema === ">") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro(">");
        return false;
    }

    private id(): boolean {
        if (this.token?.tipo === "ID") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("ID");
        return false;
    }

    private declarationArrow(): boolean {
        if (this.token?.lexema === "->") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro("->");
        return false;
    }

    private semi(): boolean {
        if (this.token?.lexema === ";") {
            this.token = this.getNextToken();
            return true;
        }

        this.erro(";");
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

        this.erro("begin");
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

        this.erro("end");
        return false;
    }
}