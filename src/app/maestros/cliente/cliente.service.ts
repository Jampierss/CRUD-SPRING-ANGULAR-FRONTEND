import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Cliente } from './cliente';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = environment.apiURL + 'api/cliente';

  constructor(private http: HttpClient) { }

  getClienteById(id: number): Observable<Cliente>  {
    return this.http.get(`${this.urlEndPoint}/busqueda/${id}`).pipe(
      map((response: any) => response as Cliente)
    );
  }

  getClientePaginate(pagina: number): Observable<Cliente[]> {
    let i: number = 0;
    let url: string = `${this.urlEndPoint}/page`;

    url += `&pagina=${pagina}`;

    url = url.replace('&', '?');

    return this.http.get(url).pipe(
      tap((response: any) => {
        i = (response.pageable.pageNumber) * response.size;
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cli => {
          cli.nro = ++i;
          return cli;
        });
        return response;
      })
    );
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(`${this.urlEndPoint}`, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/update/${cliente.id}`, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
