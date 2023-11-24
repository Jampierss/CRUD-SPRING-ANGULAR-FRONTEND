import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subarea } from './subarea';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubareaService {

  private urlEndPoint: string = environment.apiURL + 'api/subarea';

  constructor(private http: HttpClient) { }

  getSubareas(): Observable<Subarea[]> {
    return this.http.get<Subarea[]>(`${this.urlEndPoint}/listado`).pipe(
      map((response: any) => response as Subarea[])
    );
  }

  getSubareaById(id: string): Observable<Subarea> {
    return this.http.get<Subarea>(`${this.urlEndPoint}/busqueda/${id}`).pipe(
      map((response: any) => response as Subarea)
    );
  }

  getSubareasPaginate(nombre: string, areaNombre: string, estadoId: number, pagina: number): Observable<Subarea[]> {
    let i: number = 0;
    let url: string = `${this.urlEndPoint}/page`

    if (nombre && nombre.length > 0) {
      url += `&nombre=${nombre}`;
    }

    if (areaNombre && areaNombre.length > 0) {
      url += `&areaNombre=${areaNombre}`;
    }

    if (estadoId != undefined && estadoId > -1) {
      url += `&estadoId=${estadoId}`;
    }
    
    url += `&pagina=${pagina}`;

    url = url.replace('&', '?');

    return this.http.get<Subarea[]>(url).pipe(
      tap((response: any) => {
        i = (response.pageable.pageNumber) * response.size;
      }),

      map((response:any) => {
        (response.content as Subarea[]).map(suba => {
          suba.nro = ++i;
          return suba;
        });
        
        return response;
      })
    );

  }


  getSubareaAutocomplete(nombre: string): Observable<Subarea[]> {
    return this.http.get<Subarea[]>(`${this.urlEndPoint}/autocomplete?nombre=${nombre}`).pipe(
      map((response: any) => response.subarea as Subarea[])
    );
  }

  crearSubarea(subarea: Subarea): Observable<Subarea> {
    return this.http.post<Subarea>(`${this.urlEndPoint}`, subarea).pipe(
      map((response: any) => response.subarea as Subarea),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  actualizarSubarea(subarea: Subarea): Observable<Subarea> {
    return this.http.put(`${this.urlEndPoint}/update/${subarea.id}`, subarea).pipe(
      map((response: any) => response.subarea as Subarea),
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
