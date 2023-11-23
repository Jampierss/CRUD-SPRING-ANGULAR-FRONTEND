import { SubModulo } from "./sub-modulo";

export class Modulo {
    id: number;
    icon: string;
    nombre: string;
    subModulos: SubModulo[];
    abierto: boolean = false;
}
