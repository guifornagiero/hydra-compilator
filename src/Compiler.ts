import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    
    -- comentario --

    var <int> aa -> 10 + 20;
    var <bool> flag -> true;

    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
// console.log(tokens);

const parser = new Parser(tokens);

const ast = parser.parse();

ast.printTree();
ast.printCode();