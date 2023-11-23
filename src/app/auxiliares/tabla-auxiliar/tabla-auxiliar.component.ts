import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Modulo } from 'src/app/usuarios/models/modulo';
import { SubModulo } from 'src/app/usuarios/models/sub-modulo';
import { ModuloService } from 'src/app/usuarios/modulo.service';
import { SubModuloService } from 'src/app/usuarios/sub-modulo.service';
import { TablaAuxiliar } from './models/tabla-auxiliar';
import { TablaAuxiliarDetalle } from './models/tabla-auxiliar-detalle';
import { TablaAuxiliarDetalleId } from './models/tabla-auxiliar-detalle-id';
import { TablaAuxiliarService } from './tabla-auxiliar.service';

@Component({
  selector: 'app-tabla-auxiliar',
  templateUrl: './tabla-auxiliar.component.html',
  styleUrls: ['./tabla-auxiliar.component.css']
})
export class TablaAuxiliarComponent implements OnInit {
  moduloFiltro: Modulo = undefined;
  subModuloFiltro: SubModulo = undefined;
  modulos: Modulo[];
  submodulos: SubModulo[];

  tablaAuxiliar: TablaAuxiliar[];
  tablaAuxiliarDetalle: TablaAuxiliarDetalle[];
  tablaAuxiliarDetalleId: TablaAuxiliarDetalleId;
  tablaAuxSeleccionado: TablaAuxiliar;
  tablaAuxDetalleSeleccionado: TablaAuxiliarDetalle;

  blnCargandoDatos:boolean = false;
  blnGuardando:boolean = false;

  editableTable1: number = 0;
  editableTable2: number = -1;

  valor: boolean = true;
  valorNombre: string = "";

  eventoNuevo: boolean = false;
  eventoModificar: boolean = false;
  eventoAgregar: boolean = true;
  eventoGuardar: boolean = false;

  validarFila: number = -1;
  validarFila2: number = -1;

  constructor(
    public tablaAuxiliarService: TablaAuxiliarService,
    public moduloService: ModuloService,
    public subModuloService: SubModuloService,
    public toastr: ToastrService,
    public router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.moduloService.getAllModulo().subscribe(mod => {
      this.modulos = mod;
      this.submodulos = [];
    }, err => {
      this.toastr.error("Hubo un error al cargar los datos", "Error");
    });
    this.filtrar();
  }

  filtrar(){
    this.blnCargandoDatos = true;
    this.tablaAuxiliar = [];
    this.tablaAuxiliarDetalle = [];
    this.tablaAuxiliarDetalleId = undefined;
    this.tablaAuxSeleccionado = undefined;
    this.tablaAuxDetalleSeleccionado = undefined;
    this.editableTable1 = 0;
    this.editableTable2 = -1;
    this.valor = true;
    this.valorNombre  = "";
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.eventoAgregar = true;
    this.eventoGuardar = false;
    this.validarFila = -1;
    this.validarFila2 = -1;

    this.tablaAuxiliarService.getAllTablaAuxiliarFiltro(
      this.moduloFiltro   ?this.moduloFiltro.id : undefined,
      this.subModuloFiltro? this.subModuloFiltro.id : undefined
    ).subscribe(tablaAux => {
      this.tablaAuxiliar = tablaAux;
      this.eventoAgregar = true;
      this.blnCargandoDatos = false;
      if (this.editableTable1 >= 0 && this.tablaAuxiliar.length > 0) {
        let tab: TablaAuxiliar = this.tablaAuxiliar[this.editableTable1];
        if (tab != undefined) {
          this.verTablaAux(tab, this.editableTable1);
        }
      }
    }, err => {
      this.toastr.error("Hubo un error al cargar los datos del servidor", "Error");
      this.tablaAuxiliar = [];
    });
  }

  compararModulo(p1: Modulo, p2: Modulo): boolean {
    if (p1 === undefined && p2 === undefined) {
      return true;
    }
    return p1 === null || p2 === null || p1 === undefined || p2 === undefined ? false : p1.id === p2.id;
  }

  onChangeModulo(mod: Modulo): void {

    this.subModuloFiltro = undefined;

    if (this.moduloFiltro == undefined) {
      this.submodulos = [];
    } else {
      this.editableTable1 = -1;
      this.tablaAuxiliarDetalle = null;
      this.subModuloService.getSubModuloIdModulo(mod.id).subscribe(sub => {
        this.submodulos = sub;
      },err=>{
        this.submodulos = [];
      });
    }
    this.filtrar();
  }

  onChangeSubModulo(sub: SubModulo): void {
    this.filtrar();
  }

  compararSubModulos(p1: SubModulo, p2: SubModulo): boolean {
    if (p1 === undefined && p2 === undefined) {
      return true;
    }
    return p1 === null || p2 === null || p1 === undefined || p2 === undefined ? false : p1.id === p2.id;
  }

  verTablaAux(tablaAux: TablaAuxiliar, i: number) {
    if (!this.eventoNuevo) {
      this.editableTable1 = i;
      this.tablaAuxSeleccionado = tablaAux;
      this.tablaAuxiliarService.getTablaAuxiliarDetalleXCodAux(tablaAux.codTablaAuxiliar).subscribe(tabAuxDetalle => {
        this.tablaAuxiliarDetalle = tabAuxDetalle;
        this.eventoAgregar = false;
      });
    }
  }

  nuevo(): void {
    this.eventoGuardar = true
    this.eventoNuevo = true
    this.eventoModificar = false
    this.eventoAgregar = true

    this.tablaAuxDetalleSeleccionado = new TablaAuxiliarDetalle();

    this.tablaAuxiliarDetalleId = new TablaAuxiliarDetalleId();
    this.tablaAuxiliarDetalleId.id = this.tablaAuxiliarDetalle[this.tablaAuxiliarDetalle.length - 1].tablaAuxiliarDetalleId.id + 1
    this.tablaAuxiliarDetalleId.tablaAuxiliar = this.tablaAuxSeleccionado
    this.tablaAuxDetalleSeleccionado.tablaAuxiliarDetalleId = this.tablaAuxiliarDetalleId

    this.tablaAuxDetalleSeleccionado.nro = 0;
    this.tablaAuxDetalleSeleccionado.indHabilitado = false;
    this.editableTable2 = 0;
    this.validarFila2 = this.editableTable2;
    this.tablaAuxiliarDetalle.unshift(this.tablaAuxDetalleSeleccionado);
  }

  cancelar(): void {
    this.filtrar();
  }

  modificar(): void {
    this.eventoGuardar = true
    this.eventoAgregar = true
    this.eventoNuevo = true;
    this.eventoModificar = false;
    this.validarFila2 = this.editableTable2

    this.valorNombre = this.tablaAuxDetalleSeleccionado.nombre
  }

  guardar(): void {

    let fechaActual = new Date();
    
    if(!this.validarTablaauxiliarDetalle(this.tablaAuxDetalleSeleccionado)){
      return;
    }

    this.blnGuardando = true;

    if (this.tablaAuxDetalleSeleccionado.nro == 0) {
      this.tablaAuxDetalleSeleccionado.fechaCrea = fechaActual;
      this.tablaAuxDetalleSeleccionado.idUsuarioCrea = this.authService.usuario.id;

      this.tablaAuxiliarService.create(this.tablaAuxDetalleSeleccionado).subscribe(res => {
        this.blnGuardando = false;
        this.toastr.success('Se registró correctamente', 'Éxito');
        this.filtrar();
      }, err => {
        this.blnGuardando = false;
        this.toastr.error('Hubo un error al registrar', 'Error')
      });
    } else {
      this.tablaAuxiliarService.updateTablaAuxiliarDetalle(this.tablaAuxDetalleSeleccionado,
        this.valorNombre, this.tablaAuxSeleccionado.codTablaAuxiliar).subscribe(resp => {
          this.blnGuardando = false;
          this.toastr.success('Se actualizó el valor con éxito', 'Actualizado');
          this.filtrar();
        }, err => {
          this.blnGuardando = false;
          this.toastr.error('Hubo un error al actualizar la tabla', 'Error');
        });
    }
  }

  validarTablaauxiliarDetalle(aux:TablaAuxiliarDetalle){
    if(aux.nombre == null || aux.nombre == undefined || aux.nombre.length == 0){
      this.toastr.warning('Debe de ingresar el nombre', 'Error');
      return false;
    }
    if(aux.abreviatura == null || aux.abreviatura == undefined || aux.abreviatura.length == 0){
      this.toastr.warning('Debe ingresar la abreviatura', 'Error');
      return false;
    }    

    return true;
  }

  verTablaAuxDetalle(tablaAuxDetalle: TablaAuxiliarDetalle, i: number): void {
    this.tablaAuxDetalleSeleccionado = tablaAuxDetalle;
    if (!this.eventoNuevo) {
      this.editableTable2 = i;
      this.eventoModificar = true;
    }
  }
}
