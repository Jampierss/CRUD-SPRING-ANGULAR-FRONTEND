import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo } from './cargo';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../usuarios/auth.service';
import { TablaAuxiliarService } from '../../auxiliares/tabla-auxiliar/tabla-auxiliar.service';
import { CargoService } from './cargo.service';
import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {

  rutaPaginador: string = 'cargo';
  paginador: any;
  page:number;

  editableTable1: number = -1;
  validarFila: number = -1;

  estadoF: Observable<TablaAuxiliarDetalle[]>;
  estados: TablaAuxiliarDetalle[] = [];

  cargos: Cargo[] = [];
  cargoSeleccionado: Cargo = new Cargo();

  eventoNuevo: boolean = true;
  eventoModificar: boolean = false;
  eventoGuardar: boolean = false;

  estadoActivo: TablaAuxiliarDetalle = new TablaAuxiliarDetalle();

  nombreFiltro: string = '';
  estadoFiltro: TablaAuxiliarDetalle;

  blnGuardandoDatos: boolean = true;

  constructor(private toastr: ToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private auxiliarService: TablaAuxiliarService,
              private cargoService: CargoService) { }

  ngOnInit(): void {
    this.auxiliarService.obtenerPorNombre('ESTGRL', 'Activo').subscribe(est => {
      this.estadoActivo = est;
    });

    this.auxiliarService.getComboBox('ESTGRL').subscribe(lst => {
      this.estados = lst;
    })

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number;
      let aux = params.get('page');
      if (aux == null) {
        page = -1;
      } else {
        page = + aux;
      }
      this.page = page;

      this.filtrar(page);
    });
  }

  filtrar(pagina: number = 0) {
    this.eventoNuevo = true;
    this.eventoModificar = false;
    this.eventoGuardar = false;
    this.editableTable1 = -1;
    this.validarFila = -1;
    this.cargoSeleccionado = null;
    
    if(pagina == 0 && this.page != pagina) {
      this.router.navigate([this.rutaPaginador+'/0']);
    } else {
      this.cargoService.getCargosPaginate(this.nombreFiltro, this.estadoFiltro?.tablaAuxiliarDetalleId.id, pagina).subscribe((lis: any) => {
        this.cargos = lis.content as Cargo[];
        this.paginador = lis;
        this.blnGuardandoDatos = false;
      }, err => {
        this.toastr.warning('No se pudo cargar la data', 'Error en BD');
        this.blnGuardandoDatos = false;
      });
    }  
  }

  //Autocompletado Estado
  private _filterE(value: string): Observable<TablaAuxiliarDetalle[]> {
    const filterValue = value.toUpperCase();
    return this.auxiliarService.autocompleteListEstado('ESTGRL',filterValue);
  }

  cambiarValorEstado(event): void {
    if (event.keyCode != 38 && event.keyCode != 40) {
      let autoResponse = event.target.value;
      this.estadoF = autoResponse ? this._filterE(autoResponse) : new Observable<TablaAuxiliarDetalle[]>();
    }
  }

  mostrarEstado(respons?: TablaAuxiliarDetalle): string | undefined {
    return respons ? respons.nombre : undefined;
  }
  //

  compararObjeto(t1: any, t2: any): boolean {
    if(t1 === undefined && t2 === undefined) {
      return true;
    }

    return t1 === null || t2 === null || t1 === undefined || t2 === undefined? false: t1.tablaAuxiliarDetalleId.id === t2.tablaAuxiliarDetalleId.id;
  }

  verCargo(cargo: Cargo, i: number) {
    this.cargoSeleccionado = cargo
    if (this.eventoNuevo) {
      this.editableTable1 = i;
      this.eventoModificar = true;
    }
  }

  nuevo() {
    this.cargoSeleccionado  = new Cargo();
    this.cargoSeleccionado.nro = this.cargos.length > 0?this.cargos[this.cargos.length-1].nro + 1:1;
    this.cargoSeleccionado.estado = this.estadoActivo;
    this.cargoSeleccionado.idUsuarioCrea = this.authService.usuario.id;

    this.cargos.push(this.cargoSeleccionado);
    this.editableTable1 = this.cargoSeleccionado.nro-1;
    this.validarFila = this.editableTable1;
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.eventoGuardar = true;
  }

  cancelar() {
    this.cargoSeleccionado = null;
    this.eventoNuevo = false;
    this.eventoGuardar = false;
    this.eventoModificar = false;
    this.editableTable1 = -1;
    this.validarFila = -1;

    this.filtrar();
  }

  modificar() {
    this.eventoGuardar = true;
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.validarFila = this.editableTable1;
  }

  validado(cargo: Cargo): boolean {
    if (!cargo) {
      this.toastr.warning('No se ha registrado cargo', 'Faltan datos');
      return false;
    }

    if (!cargo.nombre || cargo.nombre.length == 0) {
      this.toastr.warning('Debe ingresar el nombre del cargo', 'Faltan datos');
      return false;
    }

    if (!cargo.estado) {
      this.toastr.warning('Debe ingresar el estado del cargo', 'Faltan datos');
      return false;
    }

    return true
  }

  guardar() {
    if (!this.validado(this.cargoSeleccionado)) {
      return;
    }

    this.blnGuardandoDatos = true;
    if (this.cargoSeleccionado.id) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear() {
    this.cargoService.crearCargo(this.cargoSeleccionado).subscribe(res => {
      this.toastr.success('Cargo registrado correctamente', 'Registro');
      this.filtrar();
    })
  }

  actualizar() {
    this.cargoSeleccionado.idUsuarioModifica = this.authService.usuario.id;
    this.cargoService.actualizarCargo(this.cargoSeleccionado).subscribe(res => {
      this.toastr.success('Cargo actualizado correctamente', 'Actualización');
      this.filtrar();
    })
  }
}
