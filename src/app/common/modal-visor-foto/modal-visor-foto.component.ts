import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-visor-foto',
  templateUrl: './modal-visor-foto.component.html',
  styleUrls: ['./modal-visor-foto.component.css']
})
export class ModalVisorFotoComponent implements OnInit {

  fotos: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalVisorFotoComponent>,
  ) { }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.dialogRef.close()
      }
    });

    this.data.fotos.forEach(fot => {
      this.fotos.push(fot);
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
