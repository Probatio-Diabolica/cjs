import { Token, TokenType } from "./token.js";

export default function lex(source) {
  const tokens = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const add = (type, value = null) => {
    tokens.push(new Token(type, value, line, col));
  };

  while (i < source.length) {
    const ch = source[i];

    // whitespace
    if (ch === " " || ch === "\t" || ch === "\r") {
      i++;
      col++;
      continue;
    }

    if (ch === "\n") {
      i++;
      line++;
      col = 1;
      continue;
    }

    // numbers
    if (/[0-9]/.test(ch)) {
      let start = i;
      while (/[0-9]/.test(source[i])) i++;
      add(TokenType.NUMBER, source.slice(start, i));
      col += i - start;
      continue;
    }

    // identifiers / keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let start = i;
      while (/[a-zA-Z0-9_]/.test(source[i])) i++;
      const text = source.slice(start, i);

      const keywords = {
        int: TokenType.INT,
        return: TokenType.RETURN,
        if: TokenType.IF,
        else: TokenType.ELSE,
        break: TokenType.BREAK,
        continue: TokenType.CONTINUE,
        while: TokenType.WHILE,
        for: TokenType.FOR,
        do: TokenType.DO,
      };

      add(keywords[text] ?? TokenType.IDENT, text);
      col += i - start;
      continue;
    }

    // two char operators
    const twoChar = source.slice(i, i + 2);

    if (twoChar === "<=" || twoChar === ">=" ||
        twoChar === "==" || twoChar === "!=") {

      const map = {
        "<=": TokenType.LE,
        ">=": TokenType.GE,
        "==": TokenType.EQ,
        "!=": TokenType.NE
      };

      add(map[twoChar], twoChar);
      i += 2;
      col += 2;
      continue;
    }

    // single-char tokens
    const singles = {
      "+": TokenType.PLUS,
      "-": TokenType.MINUS,
      "*": TokenType.STAR,
      "/": TokenType.SLASH,
      "%": TokenType.PERCENT,
      "(": TokenType.LPAREN,
      ")": TokenType.RPAREN,
      "{": TokenType.LBRACE,
      "}": TokenType.RBRACE,
      ";": TokenType.SEMI,
      ",": TokenType.COMMA,
      "=": TokenType.ASSIGN,
      "<": TokenType.LT,
      ">": TokenType.GT
    };

    if (singles[ch]) {
      add(singles[ch], ch);
      i++;
      col++;
      continue;
    }

    throw new Error(`Unexpected character '${ch}' at ${line}:${col}`);
  }

  add(TokenType.EOF);
  return tokens;
}
