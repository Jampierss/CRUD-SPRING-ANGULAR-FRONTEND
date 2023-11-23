import { SubModulo } from '../../../usuarios/models/sub-modulo';
import { TablaAuxiliarDetalle } from './tabla-auxiliar-detalle'

export class TablaAuxiliar {
  nro: number = 0;
  codTablaAuxiliar: string;
  nombre: string;
  observacion: string;
  detalleAuxiliar: Array<TablaAuxiliarDetalle>=[];
  indEdicion: number;
  subModulo: SubModulo;
  idUsuarioCrea: string;
  fechaCrea: string;
}
