import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <bool> isTrue -> true;
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();