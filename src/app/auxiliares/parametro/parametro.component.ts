import { Component, OnInit } from '@angular/core';
import { Parametro } from './parametro';
import { ParametroService } from './parametro.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.css']
})

export class ParametroComponent implements OnInit {

  parametros: Parametro[];
  eventoModificar: boolean;
  eventoNuevo: boolean;

  parametroSeleccionado: Parametro = new Parametro()

  editableTable1: number = 0;
  editableTable2: number = 0;
  validarFila: number = -1;
  validarFila2: number = -1;

  constructor(public dialog: MatDialog, private router: Router, public parametroService: ParametroService, public toastr: ToastrService) { }

  ngOnInit() {

    this.parametroService.getAllParametro().subscribe(parametros => {
      this.parametros = parametros;
    })

  }

  editar() {
    if (this.editableTable1 != 0) {
      this.eventoNuevo = true;
      this.eventoModificar = false;
      this.validarFila = this.editableTable1;
      this.validarFila2 = this.editableTable2;
    }
  }

  cancelar() {
    this.parametroService.getAllParametro().subscribe(parametros => {
      this.parametros = parametros;
    });

    this.parametroSeleccionado = null
    this.eventoNuevo = false;
    this.eventoModificar = false;
    this.editableTable1 = 0;
    this.editableTable2 = 0;
    this.validarFila = -1;
    this.validarFila2 = -1;
  }

  actualizar() {

    if (this.parametroSeleccionado.tipo == "Booleano") {
      if (this.parametroSeleccionado.valorToggle) {
        this.parametroSeleccionado.valor = "1"
      } else {
        this.parametroSeleccionado.valor = "0"
      }
    }
    

    this.parametroService.updateParametro(this.parametroSeleccionado).subscribe(resp => {

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/parametros']);

      this.parametroSeleccionado = null
      this.eventoNuevo = false;
      this.eventoModificar = false;
      this.editableTable1 = 0;
      this.editableTable2 = 0;
      this.validarFila = -1;
      this.validarFila2 = -1;

      this.toastr.success('Se actualizó el valor del parámetro', 'Actualizado')
    }, err => {
      this.toastr.error('Hubo un error al actualizar el parámetro', 'Error')
    })

  }


  seleccionarParametro(parametro: Parametro, i: number) {
    if (!this.eventoNuevo) {
      this.parametroSeleccionado = parametro
      this.editableTable1 = i;
      this.editableTable2 = 0;
      this.eventoModificar = true;
    }
  }

  soloNumeros(event): void {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }
}