import lex from "../src/lexer/lexer.js";
import { TokenType } from "../src/lexer/token.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const source = `
int main() {
  return 0;
}
`;

const tokens = lex(source);

assert(tokens[0].type === TokenType.INT, "Expected INT");
assert(tokens[1].type === TokenType.IDENT, "Expected IDENT");
assert(tokens.at(-1).type === TokenType.EOF, "Expected EOF");
