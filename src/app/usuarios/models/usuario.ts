import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { Rol } from './rol';

export class Usuario {
  nro: number = 0;
  id: number;
  nombreCompleto: string;
  username: string;
  password: string;
  email: string;
  roles: Rol[];
  rolesDetallado: string[];
  rolesAuthorities: string[];
  mostrarRoles: string;
  estado: TablaAuxiliarDetalle;

  idUsuarioCrea: number;
  fechaCrea: Date;
  idUsuarioModifica: number;
  fechaModifica: Date;
}
