export class CjsError extends Error {
    constructor(message, token) {
        super(message);
        this.name = "CjsError";
        this.token = token;
    }

    toString() {
        if (!this.token) return this.message;

        return `${this.name} at line ${this.token.line}, column ${this.token.column}:\n${this.message}`;
    }
}

export class SyntaxError extends CjsError {
    constructor(message, token) {
        super(message, token);
        this.name = "SyntaxError";
    }
}

export class SemanticError extends CjsError {
    constructor(message, token) {
        super(message, token);
        this.name = "SemanticError";
    }
}
