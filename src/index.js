// import lex from "./lexer/lexer.js";

// export default function run(source, options = {}) {
//   const tokens = lex(source);
//   for (const t of tokens) {
//     console.log(t.toString());
//   }
// }


import lex from "./lexer/lexer.js";
import Parser from "./parser/parser.js";

export default function run(source) {
  const tokens = lex(source);
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();
  console.dir(ast, { depth: null });
}
