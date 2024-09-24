import { Token } from "../Models/Token";
import { AFD } from "./AFD";

export default class LiteralNumber implements AFD {

    evaluate(code: string[]): Token | null {
        if (this.isDigit(code[0])) {
            const number = this.readNumber(code);
            if (this.isEnd(code)) {
                return new Token("NUM", number);
            }
        }
        
        return null;
    }

    private isDigit (char: string): boolean {
        return char >= "0" && char <= "9";
    }

    private readNumber(code: string[]): string {
        let number = "";
        while (this.isDigit(code[0])) {
            number += code.shift();
        }

        return number;
    }

    private isEnd(code: string[]): boolean {
        return !this.isDigit(code[0]);
    }
} 