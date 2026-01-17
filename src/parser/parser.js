import { TokenType } from "../lexer/token.js";

import {
    Program,
    FunctionDecl,
    Block,
    IfStmt,
    ReturnStmt,
    NumberLiteral,
    CharLiteral,
    BinaryExpr,
    VarDecl,
    Identifier,
    Assignment,
    WhileStmt,
    BreakStmt,
    ContinueStmt,
    FunctionCall,
    OutStmt,
    ArrayAccess,
    ArrayAssign,
    ArrayDecl,
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
        const functions = [];
        
        while (this.peek().type !== TokenType.EOF) {
            functions.push(this.parseFunction());
        }
        
        return new Program(functions);
    }

    parseFunction() {
        this.expect(TokenType.INT);
        const name = this.expect(TokenType.IDENT).value;
        this.expect(TokenType.LPAREN);
        const params = [];

        if (this.peek().type !== TokenType.RPAREN) {
            do {
                // for now it only works for int. will support other types soon
                this.expect(TokenType.INT);              
                const name = this.expect(TokenType.IDENT).value;
                params.push(name);
            } while (this.peek().type === TokenType.COMMA && this.advance());
        }

        this.expect(TokenType.RPAREN);

        const body = this.parseBlock();

        return new FunctionDecl(name, params , body);
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

        if (this.peek().type === TokenType.INT ||
            this.peek().type === TokenType.CHAR) {
            return this.parseVarDecl();
        }


        if (this.peek().type === TokenType.IF) {
            return this.parseIf();
        }

        if (this.peek().type === TokenType.OUT) {
            return this.parseOut();
        }

        if (
            this.peek().type === TokenType.IDENT &&
            this.tokens[this.pos + 1]?.type === TokenType.LBRACKET
        ) {
            const name = this.advance().value;
            
            this.expect(TokenType.LBRACKET);
            const index = this.parseExpression();

            this.expect(TokenType.RBRACKET);
            this.expect(TokenType.ASSIGN);
            
            const value = this.parseExpression();
            
            this.expect(TokenType.SEMI);

            return new ArrayAssign(name, index, value);
        }

        if ( this.peek().type === TokenType.IDENT && this.tokens[this.pos + 1]?.type === TokenType.ASSIGN) {
            return this.parseAssignment();
        }

        if (this.peek().type === TokenType.RETURN) {
            return this.parseReturn();
        }

        if (this.peek().type === TokenType.FOR) {
            return this.parseFor();
        }

        if (this.peek().type === TokenType.DO) {
            return this.parseDoWhile();
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

    parseFor() {
        this.expect(TokenType.FOR);
        this.expect(TokenType.LPAREN);

        // init
        let init = null;

        if (this.peek().type !== TokenType.SEMI) {
            if (this.peek().type === TokenType.INT) {
                init = this.parseVarDecl();
            } else {
                init = this.parseAssignment();
            }
        } else {
            this.expect(TokenType.SEMI);
        }

        // condition
        let condition = null;

        if (this.peek().type !== TokenType.SEMI) {
            condition = this.parseExpression();
        }

        this.expect(TokenType.SEMI);

        // step
        let step = null;
        if (this.peek().type !== TokenType.RPAREN) {
            step = this.parseAssignmentExpr();
        }

        this.expect(TokenType.RPAREN);

        const body = this.parseStatement();

        // desugar:
        // { init; while (condition) { body; step; } }

        const stmts = [];

        if (init) stmts.push(init);

        const whileBodyStmts = [];

        if (body instanceof Block) {
            whileBodyStmts.push(...body.statements);
        } else {
            whileBodyStmts.push(body);
        }

        if (step) whileBodyStmts.push(step);

        const whileBody = new Block(whileBodyStmts);

        const whileStmt = new WhileStmt(
            condition ?? new NumberLiteral(1),
            whileBody
        );

        stmts.push(whileStmt);

        return new Block(stmts);
    }

    parseOut() {
        this.expect(TokenType.OUT);
        this.expect(TokenType.LPAREN);
     
        const expr = this.parseExpression();
     
        this.expect(TokenType.RPAREN);
        this.expect(TokenType.SEMI);
     
        return new OutStmt(expr);
    }


    parseWhile() {
        this.expect(TokenType.WHILE);

        this.expect(TokenType.LPAREN);
        const condition = this.parseExpression();
        
        this.expect(TokenType.RPAREN);
        const body = this.parseStatement();

        return new WhileStmt(condition, body);
    }

    parseDoWhile() {
        this.expect(TokenType.DO);

        const body = this.parseStatement();

        this.expect(TokenType.WHILE);
        this.expect(TokenType.LPAREN);
        const condition = this.parseExpression();
        this.expect(TokenType.RPAREN);
        this.expect(TokenType.SEMI);

        //desugar:
        //{ body; while (cond) { body; } }

        const firstRun = body instanceof Block
            ? body
            : new Block([body]);

        const loopBodyStmts = [...firstRun.statements];
        const whileBody = new Block(loopBodyStmts);

        const whileStmt = new WhileStmt(condition, whileBody);

        return new Block([
            firstRun,
            whileStmt
        ]);
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
        const type = this.advance(); // INT or CHAR
        const name = this.expect(TokenType.IDENT).value;
        
        if (this.peek().type === TokenType.LBRACKET) {
            this.advance(); // [
            const size = this.parseExpression();
            this.expect(TokenType.RBRACKET);
            this.expect(TokenType.SEMI);
            return new ArrayDecl(name, size);
        }

        if (type.type !== TokenType.INT && type.type !== TokenType.CHAR) {
            throw new Error("Expected type");
        }

        



        let init = null;
        if (this.peek().type === TokenType.ASSIGN) {
            this.advance();
            init = this.parseExpression();
        }

        this.expect(TokenType.SEMI);
        return new VarDecl(type.type, name, init);
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

    parseAssignmentExpr() {
        const name = this.expect(TokenType.IDENT).value;
        this.expect(TokenType.ASSIGN);
        const value = this.parseExpression();
        return new Assignment(name, value);
    }

    parsePrimary() {
        if (this.peek().type === TokenType.NUMBER) {
            return new NumberLiteral(Number(this.advance().value));
        }

        if (this.peek().type === TokenType.CHAR_LITERAL) {
            return new CharLiteral(this.advance().value);
        }

        if (this.peek().type === TokenType.IDENT &&
            this.tokens[this.pos + 1]?.type === TokenType.LBRACKET) 
        {
            const name = this.advance().value;
            this.expect(TokenType.LBRACKET);
            const index = this.parseExpression();
            this.expect(TokenType.RBRACKET);
            return new ArrayAccess(name, index);
        }


        if (this.peek().type === TokenType.IDENT) {
            const name = this.advance().value;

            if (this.peek().type === TokenType.LPAREN) {

                this.advance(); // (

                const args = [];

                if (this.peek().type !== TokenType.RPAREN) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.peek().type === TokenType.COMMA && this.advance());
                }

                this.expect(TokenType.RPAREN);

                return new FunctionCall(name, args);
            }

            return new Identifier(name);
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



