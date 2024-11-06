import { Token } from "../Models/Token";
import { AFD } from "./AFD";

export default class SingleToken implements AFD {

    evaluate(code: string[]): Token | null {
        switch (code[0]) {
            case "+":
                code.shift();
                return new Token("PLUS", "+");
            case "-":
                code.shift();
                return new Token("MINUS", "-");
            case "*":
                code.shift();
                return new Token("MULT", "*");
            case "/":
                code.shift();
                return new Token("DIVISON", "/");
            case "(":
                code.shift();
                return new Token("OPEN_PAR", "(");
            case ")":
                code.shift();
                return new Token("CLOSE_PAR", ")");
            case ";":
                code.shift();
                return new Token("SEMI", ";");
            case "<":
                code.shift();
                return new Token("LESS_THEN", "<");
            case ">":
                code.shift();
                return new Token("GREATER_THEN", ">");
            case "=":
                code.shift();
                return new Token("EQUAL", "=");
            case "{":
                code.shift();
                return new Token("OPEN_BRACKET", "{");
            case "}":
                code.shift();
                return new Token("CLOSE_BRACKET", "}");
            case "|":
                code.shift();
                return new Token("PIPE", "|");
            case "&":
                code.shift();
                return new Token("AND", "&");
            case "?":
                code.shift();
                return new Token("MODULE", "?");
            default:
                return null;
        }
    }
}