export const TokenType = {
  INT: "INT",
  RETURN: "RETURN",
  IF: "IF",
  ELSE: "ELSE",
  WHILE: "WHILE",

  IDENT: "IDENT",
  NUMBER: "NUMBER",

  PLUS: "+",
  MINUS: "-",
  STAR: "*",
  SLASH: "/",
  PERCENT: "%",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  SEMI: ";",
  COMMA: ",",

  EOF: "EOF"
};

export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `${this.type}(${this.value}) @ ${this.line}:${this.column}`;
  }
}
