import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <dec> pi -> 3.14;
    var <int> num123 -> 10 * 100 + (10 - 2);
    var <string> name -> "Hello, World!";
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();