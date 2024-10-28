import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    @p(10 + 20 + 30);
    @p("Hello, World!");
    @p(variable + 10);
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();