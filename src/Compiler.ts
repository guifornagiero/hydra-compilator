import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = `
    begin;
    -- teste jwehduw --
    -- 19019013 + 173813 / 78223 ? --
    end;
`;
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
parser.parse();