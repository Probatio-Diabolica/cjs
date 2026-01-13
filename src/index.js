import lex from "./lexer/lexer.js";

export default function run(source, options = {}) {
  const tokens = lex(source);
  for (const t of tokens) {
    console.log(t.toString());
  }
}
