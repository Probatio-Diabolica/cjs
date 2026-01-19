import lex from "./lexer/lexer.js";
import Parser from "./parser/parser.js";
import Evaluator from "./interpreter/eval.js";

export default function run(source) {
  const tokens = lex(source);
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();

  const evaluator = new Evaluator();
  const result = evaluator.evalProgram(ast);

  if (result !== undefined) {
    console.log("Program exited with:", result);
  }

}
