export class Program {
    constructor(functions) {
        this.functions = functions;
    }
}

export class FunctionDecl {
    constructor(name, params ,body) {
        this.name = name;
        this.params = params; //it'll be the array of params
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




export class VarDecl {
    constructor(type, name, init) {
        this.type = type;
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

////////////////////////////////////////////
export class NumberLiteral {
    constructor(value) {
        this.value = value;
    }
}

export class CharLiteral {
    constructor(value) {
        this.value = typeof value === "number" ? value : value.charCodeAt(0);
    }
}

//Implementing arrays is a real pain... 
// not only you have to implement an empty array but also you have to think for the cases 
// if init list has elements less than or more than the size. it gave the most bugs so far

//arrays
export class ArrayDecl {
    constructor(name, size,initValues = null) {
        this.name = name;
        this.size = size;
        this.initValues = initValues;
    }
}

export class ArrayAccess {
    constructor(name, index) {
        this.name = name;
        this.index = index;
    }
}

export class ArrayAssign {
    constructor(name, index, value) {
        this.name = name;
        this.index = index;
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

//while 
export class WhileStmt {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }
}

// control block signals
export class BreakStmt {}
export class ContinueStmt {}

///////////////////////////////////////////////////////////////////////////
// function calls

//it was the most challenging one but kinda fun
export class FunctionCall {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

/////////////////////////////////////////////////////////////////////////////
//std outs and ins
export class OutStmt {
    constructor(expr) {
        this.expr = expr;
    }
}
