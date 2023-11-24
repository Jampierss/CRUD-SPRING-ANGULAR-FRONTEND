import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SubareaService } from './subarea.service';
import { TablaAuxiliarService } from '../../auxiliares/tabla-auxiliar/tabla-auxiliar.service';
import { Subarea } from './subarea';
import { ToastrService } from 'ngx-toastr';
import { TablaAuxiliarDetalle } from '../../auxiliares/tabla-auxiliar/models/tabla-auxiliar-detalle';
import { AuthService } from '../../usuarios/auth.service';
import { Area } from '../area/area';
import { AreaService } from '../area/area.service';
import { catchError, filter, map, startWith } from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-subarea',
  templateUrl: './subarea.component.html',
  styleUrls: ['./subarea.component.css']
})
export class SubareaComponent implements OnInit {

  subareas: Subarea[] = []

  rutaPaginador: string = "subarea";
  paginador: any;
  page: number;

  editableTable1: number = -1;
  validarFila: number = -1;

  estadoF: Observable<TablaAuxiliarDetalle[]>;
  estados: TablaAuxiliarDetalle[] = [];

  areaF: Observable<Area[]>;
  areas: Area[] = [];

  term: string;


  subareaSeleccionada: Subarea = new Subarea();

  eventoNuevo: boolean = true;
  eventoModificar: boolean = false;
  eventoGuardar: boolean = false;

  estadoActivo: TablaAuxiliarDetalle = new TablaAuxiliarDetalle();

  nombreFiltro: string = '';
  estadoFiltro: TablaAuxiliarDetalle;
  areaFiltro: string = '';

  blnGuardandoDatos: boolean = true;

  constructor(private router: Router,
              private subareaService: SubareaService,
              private toastr: ToastrService,
              private auxiliarService: TablaAuxiliarService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private areaService: AreaService) { }

  ngOnInit(): void {

    this.auxiliarService.obtenerPorNombre('ESTGRL', 'Activo').subscribe(est => {
      this.estadoActivo = est;
    })

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

  // cargar() {
  //   this.subareaService.getSubareas().subscribe((sub: any) => {
  //     this.subareas = sub as Subarea[];
  //     console.log(this.subareas);
  //   })
  // }

  // filtrarByArea() {
  //   console.log("AJAM")
  // }

  filtrar(pagina: number = 0) {

    this.eventoNuevo = true;
    this.eventoModificar = false;
    this.eventoGuardar = false;
    this.editableTable1 = -1;
    this.validarFila = -1;
    this.subareaSeleccionada = null;

    if (pagina == 0 && this.page != pagina) {
      this.router.navigate([this.rutaPaginador + '/0']);
    } else {
      this.subareaService.getSubareasPaginate(this.nombreFiltro, this.areaFiltro,  this.estadoFiltro?.tablaAuxiliarDetalleId.id, pagina).subscribe((lis: any) => {
        this.subareas = lis.content as Subarea[];
        console.log(this.subareas)
        this.paginador = lis;
        this.blnGuardandoDatos = false;
      }, err => {
        this.toastr.warning('No se pudo cargar la data', 'Error en BD');
        this.blnGuardandoDatos = false;
      });
    }
  }

  private _filterE(value: string): Observable<TablaAuxiliarDetalle[]> {
    const filterValue = value.toUpperCase();
    return this.auxiliarService.autocompleteListEstado('ESTGRL', filterValue);
  }

  private _filterA(value: string): Observable<Area[]> {
    const filterValue = value.toUpperCase();
    console.log(filterValue)
    console.log(this.areaService.autocompleteListArea(filterValue))
    return this.areaService.autocompleteListArea(filterValue);
  }

  cambiarValorEstado(event) {
    if (event.keyCode != 38 && event.keyCode != 40) {
      let autoResponse = event.target.value;
      this.estadoF = autoResponse ? this._filterE(autoResponse): new Observable<TablaAuxiliarDetalle[]>();
    }
  }

  cambiarValorArea(event) {
    if (event.keyCode != 38 && event.keyCode != 40) {
      let autoResponse = event.target.value;
      this.areaF = autoResponse ? this._filterA(autoResponse): new Observable<Area[]>();
      console.log(this.areaF)
    }
  }

  mostrarEstado(response ?: TablaAuxiliarDetalle): string | undefined {
    return response ? response.nombre: undefined;
  }

  mostrarArea(response ?: Area): string | undefined {
    return response ? response.nombre: undefined;
  }

  compararObjeto(t1: any, t2: any): boolean {
    if (t1 === undefined && t2 === undefined) {
      return true;
    }

    return t1 === null || t2 === null || t1 === undefined || t2 === undefined? false: t1.tablaAuxiliarDetalleId.id === t2.tablaAuxiliarDetalleId.id;
  }

  verSubarea(subarea: Subarea, i: number) {
    this.subareaSeleccionada = subarea;

    if (this.eventoNuevo) {
      this.editableTable1 = i;
      this.eventoModificar = true;
    }
  }

  nuevo() {

    let a = 0;
    this.subareaSeleccionada = new Subarea();

    console.log("THIS.SUBAREAS.NRO: " + this.subareaSeleccionada.nro)
    console.log("THIS.SUBAREAS.LENGTH: " + this.subareas.length)

    console.log("--- " + (this.subareas[this.subareas.length-1].nro +1))

    this.subareaSeleccionada.nro = this.subareas.length > 0?this.subareas[this.subareas.length-1].nro + 1: 1;
    a = this.subareas.length;

    console.log("AFTER THIS.SUBAREAS.NRO: " + this.subareaSeleccionada.nro)
    console.log("AFTER THIS.SUBAREAS.LENGTH: " + this.subareas.length)
    
    this.subareaSeleccionada.estado = this.estadoActivo;
    this.subareaSeleccionada.idUsuarioCrea = this.authService.usuario.id;

    this.subareas.push(this.subareaSeleccionada);
    console.log("NUEVO 1: " + this.validarFila)
    this.editableTable1 = this.subareaSeleccionada.nro-1;
    this.validarFila = a;
    console.log("NUEVO 2: " + this.validarFila)
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.eventoGuardar = true;
  }

  cancelar() {
    this.subareaSeleccionada = null;
    this.eventoNuevo = false;
    this.eventoGuardar = false;
    this.eventoModificar = false;
    this.editableTable1 = -1;
    this.validarFila = -1;

    console.log(this.validarFila)

    this.filtrar();
  }

  modificar() {
    this.eventoGuardar = true;
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.validarFila = this.editableTable1;
    
    console.log(this.validarFila);
  }

  validado(subarea: Subarea): boolean {
    if (!subarea) {
      this.toastr.warning('No se ha registrado cargo', 'Faltan datos');
      return false;
    }

    if (!subarea.nombre || subarea.nombre.length == 0) {
      this.toastr.warning('Debe ingresar el nombre del cargo', 'Faltan datos');
      return false;
    }

    if (!subarea.estado) {
      this.toastr.warning('Debe ingresar el estado del cargo', 'Faltan datos');
      return false;
    }

    return true;

  }

  guardar() {
    if (!this.validado(this.subareaSeleccionada)) {
      return;
    }

    this.blnGuardandoDatos = true;
    
    if (this.subareaSeleccionada.id) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear() {
    this.subareaService.crearSubarea(this.subareaSeleccionada).subscribe(res => {
      this.toastr.success('Cargo registrado correctamente', 'Registro');
      this.filtrar();
    })
  }

  actualizar() {
    this.subareaSeleccionada.idUsuarioModifica = this.authService.usuario.id;
    this.subareaService.actualizarSubarea(this.subareaSeleccionada).subscribe(res => {
      this.toastr.success('Cargo actualizado correctamente', 'Actualización');
      this.filtrar();
    })
  }


}
