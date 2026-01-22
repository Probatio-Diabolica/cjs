export const TokenType = {
  //keywords
  INT: "INT",
  CHAR:"CHAR",
  RETURN: "RETURN",
  IF: "IF",
  ELSE: "ELSE",

  //loops
  WHILE: "WHILE",
  FOR: "FOR",
  DO:  "DO",
  
  //control signals
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",

  //identifiers & literals 
  IDENT: "IDENT",
  NUMBER: "NUMBER",
  CHAR_LITERAL: "CHAR_LITERAL",
  STRING_LITERAL:"STRING_LITERAL",

  //assignment op
  ASSIGN: "=",

  //arithmetic ops
  PLUS: "+",
  MINUS: "-",
  STAR: "*",
  SLASH: "/",
  PERCENT: "%",

  //delimiters
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  LBRACKET:"[",
  RBRACKET:"]",
  SEMI: ";",
  COMMA: ",",

  //ccomparison ops  
  LT: "<",
  GT: ">",
  LE: "<=",
  GE: ">=",
  EQ: "==",
  NE: "!=",

  //note: unimplemented
  //logical
  AND:"&&",
  OR:"||",
  NOT:"!",

  //extras for now::
  OUT:"OUT",

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
