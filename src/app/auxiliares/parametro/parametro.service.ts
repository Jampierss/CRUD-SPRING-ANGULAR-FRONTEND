import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Parametro } from './parametro';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  private urlEndPoint: string = environment.apiURL + 'api/parametro';

  constructor(private http: HttpClient) { }

  getParametro(id: number): Observable<Parametro> {
    return this.http.get<Parametro>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }            

  getIntervaloValor(): Observable<Parametro> {
    return this.http.get<Parametro>(`${this.urlEndPoint}/intervalo`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }
  
  getAllParametro(): Observable<Parametro[]> {
    let i: number = 0;
    return this.http.get(this.urlEndPoint + '/parametros').pipe(
      map((response: any) => {
        (response as Parametro[]).map(parametro => {
          parametro.nro = ++i
          parametro.valorToggle = false
          if(parametro.tipo == "Booleano"){
            if(parametro.valor == "1"){
              parametro.valorToggle = true
            }else{
              parametro.valorToggle = false
            }
          }
          return parametro
        })
        return response
      })
    )
  }

  updateParametro(parametro: Parametro): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${parametro.id}`, parametro).pipe(
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


}
