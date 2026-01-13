import {
  Program,
  FunctionDecl,
  Block,
  IfStmt,
  ReturnStmt,
  NumberLiteral
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
    try {
      this.evalBlock(fn.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        return e.value;
      }
      throw e;
    }
    return 0;
  }

  evalBlock(block) {
    for (const stmt of block.statements) {
      this.evalStatement(stmt);
    }
  }

  evalStatement(stmt) {
    if (stmt instanceof IfStmt) {
      const cond = this.evalExpression(stmt.condition);
      if (cond !== 0) {
        this.evalStatement(stmt.thenBranch);
      }
      return;
    }

    if (stmt instanceof ReturnStmt) {
      const value = this.evalExpression(stmt.value);
      throw new ReturnSignal(value);
    }

    throw new Error("Unknown statement type");
  }

  evalExpression(expr) {
    if (expr instanceof NumberLiteral) {
      return expr.value;
    }

    throw new Error("Unknown expression");
  }
}
