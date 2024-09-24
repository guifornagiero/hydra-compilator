import Lexer from "./Analysers/Lexer";

const code = "var <int>;";
const lexer = new Lexer(code);

const tokens = lexer.getTokens();
console.log(tokens);