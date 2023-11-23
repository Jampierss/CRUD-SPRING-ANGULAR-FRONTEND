import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cargo } from './cargo';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private urlEndPoint: string = environment.apiURL + 'api/cargo';

  constructor(private http: HttpClient) { }

  getCargoById(id: string): Observable<Cargo>  {
    return this.http.get(`${this.urlEndPoint}/busqueda/${id}`).pipe(
      map((response: any) => response as Cargo)
    );
  }

  getCargos(): Observable<Cargo[]> {
    return this.http.get(`${this.urlEndPoint}/listadoSelect`).pipe(
      map((response: any) => response as Cargo[])
    );
  }

  getCargosPaginate(nombre: string, estadoId: number, pagina: number): Observable<Cargo[]> {
    let i: number = 0;
    let url: string = `${this.urlEndPoint}/page`;

    if (nombre && nombre.length > 0) {
      url += `&nombre=${nombre}`;
    }

    if (estadoId != undefined && estadoId > -1) {
      url += `&estadoId=${estadoId}`;
    }
    
    url += `&pagina=${pagina}`;

    url = url.replace('&', '?');

    return this.http.get(url).pipe(
      tap((response: any) => {
        i = (response.pageable.pageNumber) * response.size;
      }),
      map((response: any) => {
        (response.content as Cargo[]).map(car => {
          car.nro = ++i;
          return car;
        });
        return response;
      })
    );
  }

  getCargosAutocomplete(nombre: string): Observable<Cargo[]> {
    return this.http.get(`${this.urlEndPoint}/autocomplete?nombre=${nombre}`).pipe(
      map((response: any) => response.cargos as Cargo[])
    );
  }

  crearCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post(`${this.urlEndPoint}`, cargo).pipe(
      map((response: any) => response.cargo as Cargo),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  actualizarCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.put(`${this.urlEndPoint}/update/${cargo.id}`, cargo).pipe(
      map((response: any) => response.cargo as Cargo),
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
