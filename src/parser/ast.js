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
    constructor(condition, thenBranch, elseBranch = null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
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

export class Assignment {
    constructor(name, value) {
        this.name = name;
        this.value = value;
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


////////////////////////////////////////////////////////////////////////
//loops

export class WhileStmt {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }
}


