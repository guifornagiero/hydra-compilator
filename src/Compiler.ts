import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    @i (xx = 10) >-> {
        @f (var <int> dd -> 10 | from dd to 20 | up dd) >-> {
            var <int> xx -> 30;
        }
    } @ei (xx = 20) >-> {
        @w (dd = 20 + 10) >-> {
            var <int> xx -> 30;
        }
    } @e >-> {
        var <bool> is -> false;
    }
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();