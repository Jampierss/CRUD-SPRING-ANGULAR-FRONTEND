import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-si-no',
  templateUrl: './modal-si-no.component.html',
  styleUrls: ['./modal-si-no.component.css']
})
export class ModalSiNoComponent implements OnInit {

  titulo: string = '';
  texto: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalSiNoComponent>,
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.texto = this.data.texto;
  }

  si() {
    this.dialogRef.close({data: 1})
  }

  no() {
    this.dialogRef.close({data: 0})
  }
}
