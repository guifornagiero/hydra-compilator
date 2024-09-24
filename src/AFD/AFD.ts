import { Token } from "../Models/Token";

export interface AFD {
    evaluate(code: string[]): Token | null;
}