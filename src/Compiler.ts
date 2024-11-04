import  fs from "fs";
import Lexer from "./Analysers/Lexer";
import Parser from "./Analysers/Parser";

const code = fs.readFileSync("code.hydra", { encoding: "utf-8" });

const lexer = new Lexer(code);
const tokens = lexer.getTokens();
console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();

// ast.printTree();