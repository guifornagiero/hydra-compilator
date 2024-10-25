import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    @i (xx = 10) >-> {
        var <bool> is -> true;
        @f (var <int> ix -> 0 | from ix to 10 | up ix) >-> { }
    }

    @w (10 + 20 = 30 - 2) >-> {
        var <string> xx -> "gui";
    }
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();