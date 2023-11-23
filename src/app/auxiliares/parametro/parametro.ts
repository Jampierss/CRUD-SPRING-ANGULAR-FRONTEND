import { SubModulo } from "../../usuarios/models/sub-modulo";

export class Parametro{
    nro: number = 0;
    id:number;
    descripcion:string;
    valor:string;
    nombre: string;
    tipo: string;
    valorToggle: boolean;
    subModulo: SubModulo;
}