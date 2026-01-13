import { TokenType } from "../lexer/token.js";
import {
  Program,
  FunctionDecl,
  Block,
  IfStmt,
  ReturnStmt,
  NumberLiteral
} from "./ast.js";

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos];
  }

  advance() {
    return this.tokens[this.pos++];
  }

  expect(type) {
    const t = this.advance();
    if (t.type !== type) {
      throw new Error(`Expected ${type}, got ${t.type}`);
    }
    return t;
  }

  parseProgram() {
    return new Program([this.parseFunction()]);
  }

  parseFunction() {
    this.expect(TokenType.INT);
    const name = this.expect(TokenType.IDENT).value;
    this.expect(TokenType.LPAREN);
    this.expect(TokenType.RPAREN);
    return new FunctionDecl(name, this.parseBlock());
  }

  parseBlock() {
    this.expect(TokenType.LBRACE);
    const stmts = [];
    while (this.peek().type !== TokenType.RBRACE) {
      stmts.push(this.parseStatement());
    }
    this.expect(TokenType.RBRACE);
    return new Block(stmts);
  }

  parseStatement() {
    if (this.peek().type === TokenType.IF) {
      return this.parseIf();
    }
    if (this.peek().type === TokenType.RETURN) {
      return this.parseReturn();
    }
    throw new Error("Unknown statement");
  }

  parseIf() {
    this.expect(TokenType.IF);
    this.expect(TokenType.LPAREN);
    const cond = this.parseExpression();
    this.expect(TokenType.RPAREN);
    return new IfStmt(cond, this.parseStatement());
  }

  parseReturn() {
    this.expect(TokenType.RETURN);
    const value = this.parseExpression();
    this.expect(TokenType.SEMI);
    return new ReturnStmt(value);
  }

  parseExpression() {
    const t = this.expect(TokenType.NUMBER);
    return new NumberLiteral(Number(t.value));
  }
}
