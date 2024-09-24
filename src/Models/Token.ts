export class Token {
    public tipo: string;
    public lexema: string;

    constructor(tipo: string, lexema: string) {
        this.tipo = tipo;
        this.lexema = lexema;
    }

    public toString(): string {
        return `<${this.tipo},${this.lexema}>`;
    }
}
