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

export class VarDecl {
    constructor(name, init) {
        this.name = name;
        this.init = init;
    }
}

export class Identifier {
    constructor(name) {
        this.name = name;
    }
}

///////////////////////////////////////////////////////////////////////
// arithmetics

export class BinaryExpr {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
