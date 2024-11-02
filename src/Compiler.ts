import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    var <int> input -> 10;
    var <string> name -> "John";
    var <bool> isTrue -> true;
    var <dec> pi -> 3.14;
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
// console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();

// ast.printTree();