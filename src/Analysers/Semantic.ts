export default class Semantic {
    private variables: Record<string, any>;

    constructor() {
        this.variables = {};
    }

    public declareVariable(name: string, type: string, callback: Function)  {
        if (this.variables[name]) {
            throw new Error(`Variável '${name}' já declarada!`);
        }

        this.variables[name] = type;
        callback();
    }

    public redeclareVariable(name: string, callback: Function) {
        if (!this.variables[name]) {
            throw new Error(`Variável '${name}' não declarada!`);
        }

        callback();
    }

    public printVariables() {
        console.table(this.variables);
    }

    public variableExists(name: string) {
        if (!this.variables[name])
            throw new Error(`Variável '${name}' não declarada!`);
    }

    public getVariables() {
        return this.variables;
    }
}