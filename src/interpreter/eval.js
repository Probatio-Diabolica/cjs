import Environment from "./environment.js";
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
} from "../parser/ast.js";



class ReturnSignal {
    constructor(value) {
        this.value = value;
    }
}

export default class Evaluator {
    evalProgram(program) {
        const main = program.functions.find(f => f.name === "main");
        if (!main) {
        throw new Error("No main function");
        }
        return this.evalFunction(main);
    }

    evalFunction(fn) {
        const env = new Environment();

        try {
            this.evalBlock(fn.body, env);
        } catch (e) {
            if (e instanceof ReturnSignal) {
            return e.value;
            }
            throw e;
        }

        return 0;
    }


    evalBlock(block, env) {
        for (const stmt of block.statements) {
            this.evalStatement(stmt, env);
        }
    }


    evalStatement(stmt, env) {
        if (stmt instanceof Block) {
            this.evalBlock(stmt, env);
            return;
        }

        if (stmt instanceof VarDecl) {
            const value = stmt.init ? this.evalExpression(stmt.init, env) : 0;
            env.define(stmt.name, value);
            return;
        }

        if (stmt instanceof IfStmt) {
            const cond = this.evalExpression(stmt.condition, env);
            if (cond !== 0) {
            this.evalStatement(stmt.thenBranch, env);
            }
            return;
        }

        if (stmt instanceof ReturnStmt) {
            const value = this.evalExpression(stmt.value, env);
            throw new ReturnSignal(value);
        }

        throw new Error("Unknown statement type");
    }


    evalExpression(expr, env) {
        if (expr instanceof NumberLiteral) {
            return expr.value;
        }

        if (expr instanceof Identifier) {
            return env.get(expr.name);
        }

        if (expr instanceof BinaryExpr) {
            const left = this.evalExpression(expr.left, env);
            const right = this.evalExpression(expr.right, env);

            switch (expr.operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return Math.trunc(left / right);
            }
        }

        throw new Error("Unknown expression");
    }


}
