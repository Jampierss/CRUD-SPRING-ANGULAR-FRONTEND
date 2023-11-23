import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';

export class Area {

    id: number;
    nombre: string;
    
    abreviatura: string;
    observacion: string;
    estado: TablaAuxiliarDetalle
    idUsuarioCrea: number;
    idUsuarioModifica: number;

}
