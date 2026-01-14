import { TokenType } from "../lexer/token.js";
import {
  Program,
  FunctionDecl,
  Block,
  IfStmt,
  ReturnStmt,
  NumberLiteral,
  BinaryExpr,
  VarDecl,
  Identifier
} from "./ast.js";



// implemets classic recursive-descent precedence parsing
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
        if (this.peek().type === TokenType.LBRACE) {
            return this.parseBlock();
        }

        if (this.peek().type === TokenType.INT) {
            return this.parseVarDecl();
        }

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

    parseVarDecl() {
        this.expect(TokenType.INT);
        const name = this.expect(TokenType.IDENT).value;

        let init = null;
        if (this.peek().type === TokenType.ASSIGN) {
            this.advance();
            init = this.parseExpression();
        }

        this.expect(TokenType.SEMI);
        return new VarDecl(name, init);
    }


    parseReturn() {
        this.expect(TokenType.RETURN);
        const value = this.parseExpression();
        this.expect(TokenType.SEMI);
        return new ReturnStmt(value);
    }

    parseExpression() {
        return this.parseAdditive();
    }

    parseAdditive() {
        let expr = this.parseMultiplicative();

        while (
            this.peek().type === TokenType.PLUS ||
            this.peek().type === TokenType.MINUS
        ) {
            const op = this.advance().type;
            const right = this.parseMultiplicative();
            expr = new BinaryExpr(expr, op, right);
        }

        return expr;
    }

    parseMultiplicative() {
    let expr = this.parsePrimary();

    while (
        this.peek().type === TokenType.STAR ||
        this.peek().type === TokenType.SLASH
    ) {
        const op = this.advance().type;
        const right = this.parsePrimary();
        expr = new BinaryExpr(expr, op, right);
    }

    return expr;
    }

    parsePrimary() {
        if (this.peek().type === TokenType.NUMBER) {
            return new NumberLiteral(Number(this.advance().value));
        }

        if (this.peek().type === TokenType.IDENT) {
            return new Identifier(this.advance().value);
        }

        if (this.peek().type === TokenType.LPAREN) {
            this.advance();
            const expr = this.parseExpression();
            this.expect(TokenType.RPAREN);
            return expr;
        }

        throw new Error("Expected expression");
    }


}



