export class Program {
  constructor(functions) {
    this.functions = functions;
  }
}

export class FunctionDecl {
  constructor(name, body) {
    this.name = name;
    this.body = body;
  }
}

export class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

export class IfStmt {
  constructor(condition, thenBranch) {
    this.condition = condition;
    this.thenBranch = thenBranch;
  }
}

export class ReturnStmt {
  constructor(value) {
    this.value = value;
  }
}

export class NumberLiteral {
  constructor(value) {
    this.value = value;
  }
}
