import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <string> input -> @r("Enter your name: ");
    var <int> num -> 10 + 20 - 30;
    var <bool> isTrue -> true;

    @i (num > 0) >-> {
        @p("Positive number");
    } @ei (num < 0) >-> {
        @p("Negative number");
    } @e >-> {
        @p("Zero");
    }
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();