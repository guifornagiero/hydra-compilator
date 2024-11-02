import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <int> num -> 10 + 20 - (12 * 10);
    var <string> xx -> "asiodjaijsd";
    var <bool> yy -> true;
    var <dec> ii -> 234.203;

    @f (var <int> ii -> 0 | from ii to 10 | up ii) >-> {
        @i (ii < 5) >-> {
            @p(ii);
        } @e >-> {
            @p(ii + 2); 
        }
    }
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
// console.log(tokens);

const parser = new Parser(tokens);
parser.parse();