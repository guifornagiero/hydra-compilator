import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <asddd> aa -> 10;
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
// console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();

// ast.printTree();