import { Token } from "../Models/Token";
import { AFD } from "./AFD";

export default class Identifier implements AFD {
    private keywords: Record<string, string>;

    constructor() {
        this.keywords = {
            begin: "BEGIN",
            end: "END",
            var: "VAR",
            int: "INTEGER",
            string: "STRING",
            dec: "DECIMAL",
            true: "TRUE",
            false: "FALSE",
            from: "FROM",
            to: "TO",
            up: "UP"
        }
    }

    evaluate(code: string[]): Token | null {
        if (this.isAlphabetic(code[0])) {
            if (this.isAlphaNumeric(code[1])) {
                const word = this.readWord(code);

                if (this.isEnd(code)) {
                    const reserved = this.getReservedWord(word)
                    if (!!reserved)
                        return new Token(reserved, word);
                    else
                        return new Token("ID", word);
                }
            }
        }

        return null;
    }

    private readWord(code: string[]): string {
        let word = "";
        while (this.isAlphaNumeric(code[0])) {
            word += code.shift();
        }

        return word;
    }

    private getReservedWord(word: string): string | undefined {
        return this.keywords[word];
    }

    private isAlphabetic (char: string): boolean {
        return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z"); 
    };

    private isDigit (char: string): boolean {
        return char >= "0" && char <= "9";
    }

    private isAlphaNumeric (char: string): boolean {
        return this.isAlphabetic(char) || this.isDigit(char);
    };

    private isEnd(code: string[]): boolean {
        return !this.isAlphaNumeric(code[0]);
    }
}