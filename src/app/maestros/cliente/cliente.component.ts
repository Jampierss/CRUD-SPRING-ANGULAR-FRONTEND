import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../usuarios/auth.service';
import { Cliente } from './cliente';
import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { Router, ActivatedRoute } from '@angular/router';
import { TablaAuxiliarService } from '../../auxiliares/tabla-auxiliar/tabla-auxiliar.service';
import { ClienteService } from './cliente.service';
import { Cargo } from '../cargo/cargo';
import { CargoService } from '../cargo/cargo.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  rutaPaginador: string = 'cliente';
  paginador: any;
  pagina: number;

  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente = null;

  tiposDocumentoIdentidad: TablaAuxiliarDetalle[];
  estados: TablaAuxiliarDetalle[];
  cargos: Cargo[];

  estadoActivo: TablaAuxiliarDetalle = new TablaAuxiliarDetalle();

  fotoSeleccionada: File;
  imagenVistaPrevia: string;
  fotoInput: any;

  blnActive: boolean = false;
  blnGuardandoDatos: boolean = true;

  filaSeleccionada: number = 0;

  constructor(private toastr: ToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private auxiliarService: TablaAuxiliarService,
              private cargoService: CargoService,
              private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.auxiliarService.obtenerPorNombre('ESTGRL', 'Activo').subscribe(est => {
      this.estadoActivo = est;
    });

    this.auxiliarService.getComboBox('ESTGRL').subscribe(lst => {
      this.estados = lst;
    });

    this.auxiliarService.getComboBox('TIPDID').subscribe(lst => {
      this.tiposDocumentoIdentidad = lst;
    });

    this.cargoService.getCargos().subscribe(lst => {
      this.cargos = lst;
    });

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number;
      let aux = params.get('page');
      if (aux == null) {
        page = -1;
      } else {
        page = + aux;
      }
      this.pagina = page;

      this.filtrar(page);
    });
  }

  compararObjeto(t1: any, t2: any): boolean {
    if(t1 === undefined && t2 === undefined) {
      return true;
    }

    return t1 === null || t2 === null || t1 === undefined || t2 === undefined? false: t1.id === t2.id;
  }

  compararAuxiliar(t1: any, t2: any): boolean {
    if(t1 === undefined && t2 === undefined) {
      return true;
    }

    return t1 === null || t2 === null || t1 === undefined || t2 === undefined? false: t1.tablaAuxiliarDetalleId.id === t2.tablaAuxiliarDetalleId.id;
  }

  filtrar(pagina: number = 0) {
    this.fotoSeleccionada = null;
    this.imagenVistaPrevia = null;
    this.fotoInput = null;

    if(pagina == 0 && this.pagina != pagina) {
      this.router.navigate([this.rutaPaginador+'/0']);
    } else {
      this.clienteService.getClientePaginate(pagina).subscribe((lis: any) => {
        this.clientes = lis.content as Cliente[];
        this.paginador = lis;

        if (this.clientes && this.clientes.length > 0) {
          this.verCliente(this.clientes[0].id, 0);
        }

        this.blnGuardandoDatos = false;
      }, err => {
        this.toastr.warning('No se pudo cargar la data', 'Error en BD');
        this.blnGuardandoDatos = false;
      });
    }  
  }

  verCliente(id: number, i: number) {
    if (!this.blnActive) {
      this.clienteService.getClienteById(id).subscribe(cli => {
        this.clienteSeleccionado = cli;

        if (this.clienteSeleccionado.foto) {
          this.fotoSeleccionada = null;
          this.imagenVistaPrevia = environment.apiURL + "api/cliente/img/" + this.clienteSeleccionado.foto;
        } else {
          this.fotoSeleccionada = null;
          this.imagenVistaPrevia = null;
        }

        this.filaSeleccionada = i;
      })
    }
  }

  nuevo() {
    this.clienteSeleccionado = new Cliente();
    this.clienteSeleccionado.idUsuarioCrea = this.authService.usuario.id;
    this.blnActive = true;
  }

  editar() {
    if(this.clienteSeleccionado.id) {
      this.blnActive = true;
    }
  }

  cancelar() {
    this.blnActive = false;
    this.filtrar();
  }

  validado(cliente: Cliente): boolean {
    if (!cliente) {
      this.toastr.warning('No se ha registrado cliente', 'Faltan datos');
      return false;
    }

    if (!cliente.nroDocumentoIdentidad || cliente.nroDocumentoIdentidad.length == 0) {
      this.toastr.warning('Debe ingresar el doc. de identidad del cliente', 'Faltan datos');
      return false;
    }

    if (!cliente.razonSocial || cliente.razonSocial.length == 0) {
      this.toastr.warning('Debe ingresar la razón social del cliente del cliente', 'Faltan datos');
      return false;
    }

    if (!cliente.estado) {
      this.toastr.warning('Debe ingresar el estado del cliente', 'Faltan datos');
      return false;
    }

    return true
  }

  guardar() {
    if (!this.validado(this.clienteSeleccionado)) {
      return;
    }

    this.blnGuardandoDatos = true;
    if (this.clienteSeleccionado.id) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear() {
    this.clienteService.crearCliente(this.clienteSeleccionado).subscribe(res => {
      if (this.fotoSeleccionada) {
        this.clienteService.subirFoto(this.fotoSeleccionada, res.id).subscribe(evt => {
          this.toastr.success("Cliente registrado correctamente", "Registro");
          this.blnActive = false;
          this.filtrar();
        }, err => {
          console.log(err);
          this.toastr.error("Hubo un error al querer registrar la foto", "Error");
        });
      } else {
        this.toastr.success("Cliente registrado correctamente", "Registro");
        this.blnActive = false;
        this.filtrar();
      }
    }, err => {
      console.log(err);
      this.toastr.error("Hubo un error al querer registrar", "Error");
    })
  }

  actualizar() {
    this.clienteSeleccionado.idUsuarioModifica = this.authService.usuario.id;
    this.clienteService.actualizarCliente(this.clienteSeleccionado).subscribe(res => {
      if (this.fotoSeleccionada) {
        this.clienteService.subirFoto(this.fotoSeleccionada, res.id).subscribe(evt => {
          this.toastr.success("Cliente actualizado correctamente", "Actualización");
          this.blnActive = false;
          this.filtrar();
        }, err => {
          console.log(err);
          this.toastr.error("Hubo un error al querer actualizar la foto", "Error");
        });
      } else {
        this.toastr.success("Cliente actualizado correctamente", "Actualización");
        this.blnActive = false;
        this.filtrar();
      }
    }, err => {
      console.log(err);
      this.toastr.error("Hubo un error al querer actualizar", "Error");
    })
  }

  cargarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(this.fotoSeleccionada);
    reader.onloadend = () => this.imagenVistaPrevia = reader.result as string;
  }

  quitarFoto() {
    this.fotoSeleccionada = null;
    this.imagenVistaPrevia = null;
    this.clienteSeleccionado.foto = null;
  }
}
