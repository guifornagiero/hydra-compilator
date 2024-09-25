import Lexer from "./Analysers/Lexer";

const code = "@f (var <int> ix -> 0 | from ix to nx | up ix) >-> { }";
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);