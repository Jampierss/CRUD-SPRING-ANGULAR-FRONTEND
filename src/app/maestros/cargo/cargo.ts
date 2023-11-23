import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';

export class Cargo {
    nro: number = 0;
    id: number;
    nombre: string;
    abreviatura: string;
    observacion: string;
    estado: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
}