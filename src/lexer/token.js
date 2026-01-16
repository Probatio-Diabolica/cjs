export const TokenType = {
  //keywords
  INT: "INT",
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
  SEMI: ";",
  COMMA: ",",

  //ccomparison ops  
  LT: "<",
  GT: ">",
  LE: "<=",
  GE: ">=",
  EQ: "==",
  NE: "!=",

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
