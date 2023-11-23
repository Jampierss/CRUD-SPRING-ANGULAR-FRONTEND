import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() paginador: any;
  @Input() queryParams:any = {};
  @Input() habilitado: any = true;
  @Input() enlacePaginador: boolean;
  @Input() verNumeros: boolean = true;
  paginas: number[];
  desde: number;
  hasta: number;
  inicio: number;
  fin: number;

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let paginadorActualizado = changes['paginador'];

    if(paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number - 3), this.paginador.totalPages - 4);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 3), 5);

    this.inicio = (this.paginador.size*this.paginador.pageable.pageNumber) + 1;
    this.fin = this.inicio + this.paginador.numberOfElements -1;

    if (this.paginador.totalPages > 4) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    }else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }
}