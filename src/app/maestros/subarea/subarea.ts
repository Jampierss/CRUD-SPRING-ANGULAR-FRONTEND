import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { Area } from '../area/area';

export class Subarea {
    nro: number = 0;
    id: number;
    nombre: string;
    area: Area;
    abreviatura: string;
    observacion: string;
    estado: TablaAuxiliarDetalle
    idUsuarioCrea: number;
    idUsuarioModifica: number;

}
