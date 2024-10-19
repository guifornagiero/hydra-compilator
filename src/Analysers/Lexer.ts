import { AFD } from "../AFD/AFD";
import ComplexToken from "../AFD/ComplexToken";
import DecimalNumber from "../AFD/DecimalNumber";
import Identifier from "../AFD/Identifier";
import LiteralNumber from "../AFD/LiteralNumber";
import SingleToken from "../AFD/SingleToken";
import { Token } from "../Models/Token";

export default class Lexer {
    private tokens: Token[];
    private afds: AFD[];
    private code: string[];

    constructor(code: string) {
        this.tokens = [];
        this.afds = [];
        this.code = code.split("");

        this.afds.push(new ComplexToken(),new DecimalNumber(), new SingleToken(), new LiteralNumber(), new Identifier());
    }

    private skipWhiteSpace(): void {
        while (this.code[0] === " " || this.code[0] === "\n") {
            this.code.shift();
        }
    }

    public getTokens(): Token[] {
        let accepted: boolean;

        while (this.code.length > 0) {
            accepted = false;
            this.skipWhiteSpace();

            if (this.code.length == 0) break;

            for (let afd of this.afds) {
                const reservCode = [...this.code];
                const token = afd.evaluate(this.code);
                console.log(token);

                if (!!token) {
                    accepted = true;
                    this.tokens.push(token);
                    break;
                } else {
                    this.code = reservCode;
                }
            }

            if (accepted) continue;
            
            throw new Error("Token not recognized: " + this.code[0])
        }

        this.tokens.push(new Token("EOF", "$"));
        return this.tokens;
    }
}