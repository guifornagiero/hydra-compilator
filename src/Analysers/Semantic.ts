export default class Semantic {
    private variables: Record<string, any>;

    constructor() {
        this.variables = {};
    }

    public declareVariable(name: string, type: string) {
        if (this.variables[name]) {
            throw new Error(`Variável ${name} já declarada!`);
        }

        this.variables[name] = type;
        this.printVariables();
    }

    public printVariables() {
        console.table(this.variables);
    }

    public getRealType(type: string): string {
        const types: Record<string, string> = {
            int: "int",
            string: "String",
            bool: "boolean",
            dec: "float",
        };

        return types[type];
    }
}