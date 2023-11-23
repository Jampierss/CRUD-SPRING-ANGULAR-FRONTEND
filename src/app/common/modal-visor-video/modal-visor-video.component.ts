import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-visor-video',
  templateUrl: './modal-visor-video.component.html',
  styleUrls: ['./modal-visor-video.component.css']
})
export class ModalVisorVideoComponent implements OnInit {

  videos: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalVisorVideoComponent>,
  ) { }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.dialogRef.close()
      }
    });

    this.data.videos.forEach(vid => {
      this.videos.push({ video: vid });
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
