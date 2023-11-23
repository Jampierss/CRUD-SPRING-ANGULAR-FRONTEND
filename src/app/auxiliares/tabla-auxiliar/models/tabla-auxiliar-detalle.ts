import { TablaAuxiliarDetalleId } from './tabla-auxiliar-detalle-id'

export class TablaAuxiliarDetalle {
  nro: number = 0;
  value: number = 0;
  tablaAuxiliarDetalleId: TablaAuxiliarDetalleId;
  nombre: string;
  abreviatura: string;
  valor: string;
  valor2: string;
  observacion: string;
  indHabilitado: boolean;
  idUsuarioCrea: number;
  fechaCrea: Date;

  valorIndHabilitado: boolean = false;
}