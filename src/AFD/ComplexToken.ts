import { Token } from "../Models/Token";
import { AFD } from "./AFD";

export default class ComplexToken implements AFD {

    evaluate(code: string[]): Token | null {
        // Funções
        if (code[0] == "@") {
            if (code[1] == "p") {
                code.shift();
                code.shift();
                return new Token("PRINT_FUNCTION", "@p");
            }

            if (code[1] == "r") {
                code.shift();
                code.shift();
                return new Token("READ_FUNCTION", "@r");
            }

            if (code[1] == "i" && code[2] != "e") {
                code.shift();
                code.shift();
                return new Token("IF", "@i");
            }

            if (code[1] == "i" && code[2] == "e") {
                code.shift();
                code.shift();
                code.shift();
                return new Token("ELSE_IF", "@ie");
            }

            if (code[1] == "e") {
                code.shift();
                code.shift();
                return new Token("ELSE", "@e");
            }

            if (code[1] == "w") {
                code.shift();
                code.shift();
                return new Token("WHILE", "@w");
            }

            if (code[1] == "f") {
                code.shift();
                code.shift();
                return new Token("FOR", "@f");
            }
        }

        if (code[0] == ">") {
            if (code[1] == ">") {
                code.shift();
                code.shift();
                return new Token("FUNCTION_DEFINITION", ">>");
            }

            if (code[1] == "-" && code[2] == ">") {
                code.shift();
                code.shift();
                code.shift();
                return new Token("SCOPE_ARROW", ">->");
            }
        }

        if (code[0] == "-") {
            if (code[1] == "-") {
                code.shift();
                code.shift();
                return new Token("COMMENT", "--");
            }

            if (code[1] == ">") {
                code.shift();
                code.shift();
                return new Token("ATTRIBUTION_ARROW", "->");
            }
        }

        return null;
    }
}