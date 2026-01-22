import Environment from "./environment.js";
import {SemanticError} from "../errors.js"
import {
    Program,
    FunctionDecl,
    WhileStmt,
    Block,
    IfStmt,
    ReturnStmt,
    NumberLiteral,
    CharLiteral,
    BinaryExpr,
    VarDecl,
    Identifier,
    Assignment,  
    BreakStmt,
    ContinueStmt,
    FunctionCall,
    OutStmt,
    ArrayAccess,
    ArrayAssign,
    ArrayDecl,
} from "../parser/ast.js";
import { TokenType } from "../lexer/token.js";




class BreakSignal {}
class ContinueSignal {}

class ReturnSignal {
    constructor(value) {
        this.value = value;
    }
}

export default class Evaluator {
    
    constructor() {
        this.functions = new Map();
    }

    evalProgram(program) {

        for (const fn of program.functions) {
            this.functions.set(fn.name, fn);
        }

        const main = this.functions.get("main");
        
        if (!main) throw new SemanticError("No main function", null);
        
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
        //crreating a new environment for a new scope
        const blockEnv = new Environment(env);

        //then this will be evaluating the statements wrt the new scope 
        for (const stmt of block.statements) {
            this.evalStatement(stmt, blockEnv);
        }
    }


    evalStatement(stmt, env) {
        if (stmt instanceof OutStmt) {
            const value = this.evalExpression(stmt.expr, env);
            console.log(value);
            return;
        }

        if (stmt instanceof ArrayDecl) {
            // const size = this.evalExpression(stmt.size, env);
            // 
            let size = 0;

            if(stmt.size){
                size = this.evalExpression(stmt.size, env);
            }else if(stmt.initValues){
                size = size.initValues.length;
            }else{
                throw new SemanticError(
                    "Array size required",
                    stmt.token
                );
            }

            if(size <= 0 ) throw new SemanticError("Array size must be positive", stmt.token);

            //if initValues are than the allocated size throw an error
            if(
                stmt.initValues && 
                size < stmt.initValues.length
            ){
                    throw new SemanticError(
                        "Initializer too long for array",
                        stmt.token
                    );
            }

            const arr = new Array(size).fill(0);

            //filling it if init vals exists. the rule is if initValues is given then fill the  
            //array with it,
            //also if initValues.size() < size, then fill the array with initValues leave the rest 
            //to be zeros 
            if (stmt.initValues) {
                for (let i = 0; i < stmt.initValues.length && i < size; i++) {
                    arr[i] = this.evalExpression(stmt.initValues[i], env);
                }
            }

            env.define(stmt.name, arr);
            return;
        }

        if (stmt instanceof ArrayAssign) {
            const arr = env.get(stmt.name); 
            const idx = this.evalExpression(stmt.index, env);
            const val = this.evalExpression(stmt.value, env);
            arr[idx] = val;
            return;
        }

        if (stmt instanceof Block) {
            this.evalBlock(stmt, env);
            return;
        }

        if (stmt instanceof VarDecl) {
            const value = stmt.init ? this.evalExpression(stmt.init, env) : 0;
            env.define(stmt.name, value);
            return;
        }

        if (stmt instanceof Assignment) {
            const value = this.evalExpression(stmt.value, env);
            env.set(stmt.name, value);
            return;
        }

        if (stmt instanceof IfStmt) {
            const cond = this.evalExpression(stmt.condition, env);
            
            if (cond !== 0) {
                this.evalStatement(stmt.thenBranch, env);
            }else if (stmt.elseBranch) {
                this.evalStatement(stmt.elseBranch, env);
            }

            return;
        }

        if (stmt instanceof WhileStmt) {
            while (this.evalExpression(stmt.condition, env) !== 0) {
                try {
                    this.evalStatement(stmt.body, env);
                } catch (e) {
                    if (e instanceof BreakSignal) break;
                
                    if (e instanceof ContinueSignal) continue;
                
                    throw e;
                }
            }
            
            return;
        }

        if (stmt instanceof BreakStmt) {
            throw new BreakSignal();
        }

        if (stmt instanceof ContinueStmt) {
            throw new ContinueSignal();
        }

        if (stmt instanceof ReturnStmt) {
            const value = this.evalExpression(stmt.value, env);
            throw new ReturnSignal(value);
        }

        throw new Error(`Internal error: unhandled statement type ${stmt.constructor.name}`);
    }


    evalExpression(expr, env) {
        if (expr instanceof NumberLiteral) {
            return expr.value;
        }

        if (expr instanceof ArrayAccess) {
            const arr = env.get(expr.name);
            const idx = this.evalExpression(expr.index, env);
            if (idx < 0 || idx >= arr.length) {
                throw new SemanticError(
                    "Array index out of bounds",
                    expr.token
                );
            }

            return arr[idx];
        }

        if (expr instanceof CharLiteral) {
            return expr.value;
        }

        if (expr instanceof Identifier) {
            return env.get(expr.name);
        }

        if (expr instanceof FunctionCall) {
            
            const fn = this.functions.get(expr.name);

            if (!fn) {
                throw new SemanticError(
                    `Undefined function '${expr.name}'`,
                    expr.token
                );
            }

            if (fn.params.length !== expr.args.length) {
                throw new SemanticError(
                    `Argument count mismatch in call to '${expr.name}'`,
                    expr.token
                );
            }

            const callEnv = new Environment();

            for (let i = 0; i < fn.params.length; i++) {
                const value = this.evalExpression(expr.args[i], env);
                callEnv.define(fn.params[i], value);
            }

            try {
                this.evalBlock(fn.body, callEnv);
            } catch (e) {
        
                if (e instanceof ReturnSignal) return e.value;
        
                throw e;
            }

            return 0;
        }

        if (expr instanceof BinaryExpr) {
            const left = this.evalExpression(expr.left, env);
            const right = this.evalExpression(expr.right, env);
            switch (expr.operator) {
                case TokenType.PLUS:
                    return left + right;
                case TokenType.MINUS:
                    return left - right;
                case TokenType.STAR:
                    return left * right;
                case TokenType.SLASH:
                        // Division by zero is undefined behavior in C.
                        // We intentionally allow it and defer to host semantics.
                    return Math.trunc(left / right);
                case TokenType.PERCENT:
                    return left % right;

                case TokenType.LT:
                    return left < right ? 1 : 0;
                case TokenType.GT:
                    return left > right ? 1 : 0;
                case TokenType.LE:
                    return left <= right ? 1 : 0;
                case TokenType.GE:
                    return left >= right ? 1 : 0;
                case TokenType.EQ:
                    return left === right ? 1 : 0;
                case TokenType.NE:
                    return left !== right ? 1 : 0;
            }
        }

        throw new Error(`Internal error: unhandled expression type ${expr.constructor.name}`);
    }


}
