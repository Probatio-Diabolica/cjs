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
        char: TokenType.CHAR,
        return: TokenType.RETURN,
        if: TokenType.IF,
        else: TokenType.ELSE,
        break: TokenType.BREAK,
        continue: TokenType.CONTINUE,
        while: TokenType.WHILE,
        for: TokenType.FOR,
        do: TokenType.DO,
        out: TokenType.OUT,
      };

      add(keywords[text] ?? TokenType.IDENT, text);
      col += i - start;
      continue;
    }

    // char literal
    if (ch === "'") {
      const startCol = col;

      i++;
      col++;

      if (i >= source.length || source[i] === "\n") {
        throw new Error(`Unterminated char literal at ${line}:${startCol}`);
      }

      const charValue = source[i];

      if (charValue === "'") {
        throw new Error(`Empty char literal at ${line}:${startCol}`);
      }

      i++;
      col++;

      if (source[i] !== "'") {
        throw new Error(`Multi-character char literal at ${line}:${startCol}`);
      }

      i++;
      col++;

      add(TokenType.CHAR_LITERAL, charValue.charCodeAt(0));
      continue;
    }

    // string literal
    if (ch === '"') {
      const startLine = line;
      const startCol = col;

      i++;     // consume opening quote
      col++;

      let value = "";

      while (i < source.length && source[i] !== '"') {
        if (source[i] === "\n") {
          throw new Error(`Unterminated string literal at ${startLine}:${startCol}`);
        }

        value += source[i];
        i++;
        col++;
      }

      if (i >= source.length) {
        throw new Error(`Unterminated string literal at ${startLine}:${startCol}`);
      }

      // consume closing quote
      i++;
      col++;
      
      // add(TokenType.STRING_LITERAL, value);

      tokens.push(  new Token(TokenType.STRING_LITERAL, value, startLine, startCol));
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
      "[": TokenType.LBRACKET, 
      "]": TokenType.RBRACKET,
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
