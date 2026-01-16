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
    Identifier,
    Assignment,
    WhileStmt,
    BreakStmt,
    ContinueStmt
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

        if ( this.peek().type === TokenType.IDENT && this.tokens[this.pos + 1]?.type === TokenType.ASSIGN) {
            return this.parseAssignment();
        }

        if (this.peek().type === TokenType.RETURN) {
            return this.parseReturn();
        }

        if (this.peek().type === TokenType.WHILE) {
            return this.parseWhile();
        }

        if (this.peek().type === TokenType.BREAK) {
            this.advance();
            this.expect(TokenType.SEMI);
            return new BreakStmt();
        }

        if (this.peek().type === TokenType.CONTINUE) {
            this.advance();
            this.expect(TokenType.SEMI);
            return new ContinueStmt();
        }

        throw new Error("Unknown statement");
    }

    parseWhile() {
        this.expect(TokenType.WHILE);

        this.expect(TokenType.LPAREN);
        const condition = this.parseExpression();
        
        this.expect(TokenType.RPAREN);
        const body = this.parseStatement();

        return new WhileStmt(condition, body);
    }


    parseIf() {
        this.expect(TokenType.IF);
        
        this.expect(TokenType.LPAREN);
        const cond = this.parseExpression();
        
        this.expect(TokenType.RPAREN);
        const thenBranch = this.parseStatement();
        
        let elseBranch = null;

        if (this.peek().type === TokenType.ELSE) {
            this.advance();
            elseBranch = this.parseStatement();
        }

        return new IfStmt(cond, thenBranch, elseBranch);
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
        return this.parseComparison();
    }

    parseComparison() {
        let expr = this.parseAdditive();

        while (
            this.peek().type === TokenType.LT ||
            this.peek().type === TokenType.GT ||
            this.peek().type === TokenType.LE ||
            this.peek().type === TokenType.GE ||
            this.peek().type === TokenType.EQ ||
            this.peek().type === TokenType.NE   ) {
            const op = this.advance().type;
            const right = this.parseAdditive();
            expr = new BinaryExpr(expr, op, right);
        }

        return expr;
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
            this.peek().type === TokenType.STAR  ||
            this.peek().type === TokenType.SLASH ||
            this.peek().type === TokenType.PERCENT
        ) {
            const op = this.advance().type;
            const right = this.parsePrimary();
            expr = new BinaryExpr(expr, op, right);
        }

        return expr;
    }

    parseAssignment() {
        const name = this.expect(TokenType.IDENT).value;
        this.expect(TokenType.ASSIGN);
        const value = this.parseExpression();
        this.expect(TokenType.SEMI);
        
        return new Assignment(name, value);
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



