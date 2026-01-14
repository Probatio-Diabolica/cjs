export default class Environment {
    constructor(parent = null) {
        this.parent = parent;
        this.values = new Map();
    }

    define(name, value) {
        if (this.values.has(name)) {
        throw new Error(`Variable '${name}' already declared`);
        }
        this.values.set(name, value);
    }

    get(name) {
        if (this.values.has(name)) {
        return this.values.get(name);
        }
        if (this.parent) {
        return this.parent.get(name);
        }
        throw new Error(`Undefined variable '${name}'`);
    }
}
