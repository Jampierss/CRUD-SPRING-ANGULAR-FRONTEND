import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { Cargo } from '../cargo/cargo';
export class Cliente {
    nro: number = 0;
    id: number;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    razonSocial: string;
    nombreComercial: string;
    abreviatura: string;
    direccion: string;
    cargo: Cargo;
    estado: TablaAuxiliarDetalle;
    foto: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
}
