import { Token, TokenType } from "./token.js";

const KEYWORDS = {
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

const isDigit = ch => /[0-9]/.test(ch);
const isIdentStart = ch => /[a-zA-Z_]/.test(ch);
const isIdent = ch => /[a-zA-Z0-9_]/.test(ch);


function scanNumber(state) {
    const startCol = state.col;
    const start = state.i;

    while (isDigit(state.source[state.i])) state.i++;

    const value = state.source.slice(start, state.i);
    state.tokens.push(new Token(TokenType.NUMBER, value, state.line, startCol));
    state.col += state.i - start;
}

function scanIdentifier(state) {
    const startCol = state.col;
    const start = state.i;

    while (isIdent(state.source[state.i])) state.i++;

    const text = state.source.slice(start, state.i);
    const type = KEYWORDS[text] ?? TokenType.IDENT;

    state.tokens.push(new Token(type, text, state.line, startCol));
    state.col += state.i - start;
}

function scanCharLiteral(state) {
    const startCol = state.col;

    state.i++; state.col++; // opening '

    if (state.i >= state.source.length || state.source[state.i] === "\n") {
      throw new Error(`Unterminated char literal at ${state.line}:${startCol}`);
    }

    const ch = state.source[state.i];

    if (ch === "'") {
      throw new Error(`Empty char literal at ${state.line}:${startCol}`);
    }

    state.i++; state.col++;

    if (state.source[state.i] !== "'") {
      throw new Error(`Multi-character char literal at ${state.line}:${startCol}`);
    }

    state.i++; state.col++;

    state.tokens.push(
      new Token(TokenType.CHAR_LITERAL, ch.charCodeAt(0), state.line, startCol)
    );
}

function scanStringLiteral(state) {
    const startLine = state.line;
    const startCol = state.col;

    state.i++; state.col++; // opening "

    let value = "";

    while (state.i < state.source.length && state.source[state.i] !== '"') {
      if (state.source[state.i] === "\n") {
        throw new Error(`Unterminated string literal at ${startLine}:${startCol}`);
      }
      value += state.source[state.i];
      state.i++; state.col++;
    }

    if (state.i >= state.source.length) {
      throw new Error(`Unterminated string literal at ${startLine}:${startCol}`);
    }

    state.i++; state.col++; // closing "

    state.tokens.push(
      new Token(TokenType.STRING_LITERAL, value, startLine, startCol)
    );
}

function skipLineComment(state) {
  state.i += 2;
  state.col += 2;

  while (state.i < state.source.length && state.source[state.i] !== "\n") {
    state.i++;
    state.col++;
  }
}

function skipBlockComment(state) {
  const startLine = state.line;
  const startCol = state.col;

  // assumes current char is '/' and next is '*'
  state.i += 2;
  state.col += 2;

  while (state.i < state.source.length) {
    if (state.source[state.i] === "\n") {
      state.i++;
      state.line++;
      state.col = 1;
      continue;
    }

    if (
      state.source[state.i] === "*" &&
      state.source[state.i + 1] === "/"
    ) {
      state.i += 2;
      state.col += 2;
      return;
    }

    state.i++;
    state.col++;
  }

  throw new Error(
    `Unterminated block comment at ${startLine}:${startCol}`
  );
}

export default function lex(source) {
  const state = {
    source,
    tokens: [],
    i: 0,
    line: 1,
    col: 1,
  };

  while (state.i < source.length) {
    const ch = source[state.i];

    // whitespace
    if (ch === " " || ch === "\t" || ch === "\r") {
      state.i++; state.col++;
      continue;
    }

    // singled lined comments
    if (ch === "/" && state.source[state.i + 1] === "/") {
      skipLineComment(state);
      continue;
    }
    // blocked comments
    if (ch === "/" && state.source[state.i + 1] === "*") {
      skipBlockComment(state);
      continue;
    }

    //next line
    if (ch === "\n") {
      state.i++; state.line++; state.col = 1;
      continue;
    }

    // numbers
    if (isDigit(ch)) {
      scanNumber(state);
      continue;
    }

    // identifiers / keywords
    if (isIdentStart(ch)) {
      scanIdentifier(state);
      continue;
    }

    // char literal
    if (ch === "'") {
      scanCharLiteral(state);
      continue;
    }

    // string literal
    if (ch === '"') {
      scanStringLiteral(state);
      continue;
    }

    // two-char operators
    const two = source.slice(state.i, state.i + 2);
    const twoCharOps = {
      "<=": TokenType.LE,
      ">=": TokenType.GE,
      "==": TokenType.EQ,
      "!=": TokenType.NE,
    };

    if (twoCharOps[two]) {
      state.tokens.push(
        new Token(twoCharOps[two], two, state.line, state.col)
      );
      state.i += 2;
      state.col += 2;
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
      ">": TokenType.GT,
    };

    if (singles[ch]) {
      state.tokens.push(
        new Token(singles[ch], ch, state.line, state.col)
      );
      state.i++; state.col++;
      continue;
    }

    throw new Error(`Unexpected character '${ch}' at ${state.line}:${state.col}`);
  }

  state.tokens.push(new Token(TokenType.EOF, null, state.line, state.col));
  return state.tokens;
}
