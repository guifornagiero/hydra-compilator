import { Token } from "../Models/Token";
import { AFD } from "./AFD";

export default class DecimalNumber implements AFD {

    evaluate(code: string[]): Token | null {
        if (this.isDigit(code[0])) {
            const number = this.readDecimal(code); 
            if (number && this.isEnd(code)) {
                return new Token("DEC", number);
            }
        }

        return null;
    }

    private isDigit(char: string): boolean {
        return char >= "0" && char <= "9";
    }

    private readDecimal(code: string[]): string | null {
        let number = "";

        
        while (this.isDigit(code[0])) {
            number += code.shift();
        }

        
        if (code[0] === ".") {
            number += code.shift(); 

           
            if (this.isDigit(code[0])) {
                while (this.isDigit(code[0])) {
                    number += code.shift();
                }
                return number;
            }
        }

       
        return null;
    }

    private isEnd(code: string[]): boolean {
        return code.length === 0 || !this.isDigit(code[0]);
    }
}
