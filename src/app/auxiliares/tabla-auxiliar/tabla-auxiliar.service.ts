import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { TablaAuxiliarDetalle } from './models/tabla-auxiliar-detalle';
import { catchError, map } from 'rxjs/operators';
import { TablaAuxiliar } from './models/tabla-auxiliar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablaAuxiliarService {

  private urlEndPoint: string = environment.apiURL + 'api/tabla_auxiliar_detalle'
  private urlEndPoint2: string = environment.apiURL + 'api/tablaAuxiliar'

  constructor(private http: HttpClient, private router: Router) { }

  getAllTablaAuxiliar(): Observable<TablaAuxiliar[]> {
    let i: number = 0;
    return this.http.get(this.urlEndPoint2 + '/all').pipe(
      map((response: any) => {
        (response as TablaAuxiliar[]).map(tabla => {

          tabla.nro = ++i

          return tabla
        })
        return response
      })
    )
  }

  getAllTablaAuxiliarFiltro(moduloId: number, subModuloId: number): Observable<TablaAuxiliar[]> {
    let i: number = 0;
    let url: string = `${this.urlEndPoint2}/filtro`;

    if (moduloId != undefined) {
      url = url + `&modulo=${moduloId}`;
    }
    if (subModuloId != undefined) {
      url = url + `&submodulo=${subModuloId}`;
    }

    url = url.replace('&', '?');

    return this.http.get(url).pipe(
      map((response: any) => {
        (response as TablaAuxiliar[]).map(tabla => {

          tabla.nro = ++i

          return tabla
        })
        return response
      })
    )
  }

  getTablaAuxiliarDetalleXCodAux(codTablaAuxiliar: string): Observable<TablaAuxiliarDetalle[]> {
    let i: number = 0;
    return this.http.get(`${this.urlEndPoint}/listaXCodAux/${codTablaAuxiliar}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(tabAuxDetalle => {
          tabAuxDetalle.nro = ++i
          tabAuxDetalle.valorIndHabilitado = false;
          return tabAuxDetalle
        })
        return response
      })
    )
  }

  obtenerPorId(codTablaAuxiliar: string, id: number): Observable<TablaAuxiliarDetalle> {
    if (!codTablaAuxiliar) {
      codTablaAuxiliar = "inexistente";
    }
    if (!id && id !== 0) {
      id = -1;
    }
    return this.http.get<TablaAuxiliarDetalle>(`${this.urlEndPoint}/id/${codTablaAuxiliar}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          // this.router.navigate(['/']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  obtenerPorNombre(codTablaAuxiliar: string, nombre: string): Observable<TablaAuxiliarDetalle> {
    if (!codTablaAuxiliar) {
      codTablaAuxiliar = "inexistente";
    }
    if (!nombre) {
      nombre = "inexistente";
    }
    return this.http.get<TablaAuxiliarDetalle>(`${this.urlEndPoint}/${codTablaAuxiliar}/${nombre}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          // this.router.navigate(['/']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  autocompleteListEstado(codTabla: string, term: string): Observable<TablaAuxiliarDetalle[]> {
    if (!term) {
      term = "inexistente";
    }

    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/autocomplete/${codTabla}/${term}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(pers => {
          return pers
        })
        return response
      })
    )
  }

  autocompleteListSeccion(codTabla: string, term: string): Observable<TablaAuxiliarDetalle[]> {
    if (!term) {
      term = "inexistente";
    }

    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/autocomplete/${codTabla}/${term}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(pers => {
          return pers
        })
        return response
      })
    )
  }

  getComboBox(codTablaAuxiliar: string): Observable<TablaAuxiliarDetalle[]> {
    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/combo_box/${codTablaAuxiliar}`).pipe(
      map((response: any) => {
        (response as TablaAuxiliarDetalle[]).map(tabla => {

          tabla.value = tabla.tablaAuxiliarDetalleId.id;

          return tabla
        })
        return response
      })
    );
  }

  updateTablaAuxiliarDetalle(tablaAuxiliarDetalle: TablaAuxiliarDetalle, nombre: string, cod_tabla: string): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${nombre}/${cod_tabla}`, tablaAuxiliarDetalle).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  create(tablaAuxiliarDetalle: TablaAuxiliarDetalle): Observable<TablaAuxiliarDetalle> {
    return this.http.post(this.urlEndPoint, tablaAuxiliarDetalle).pipe(
      map((response: any) => response.tablaAuxiliarDetalle as TablaAuxiliarDetalle),
      catchError(e => {
        if (e.status==400){
          return throwError(e);
        }
        if (e.error.mensaje) {
        }
        return throwError(e);
      })
    )
  }


}
