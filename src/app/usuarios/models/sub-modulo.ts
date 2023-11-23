import { Menu } from "./menu";
import { Modulo } from "./modulo";

export class SubModulo {
    id: number;
    icon:string;
    modulo: Modulo;
    nombre: string;
    menus: Menu[];
    abierto: boolean = false;
}
