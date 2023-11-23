import { Injectable } from '@angular/core';
import { SubModulo } from './models/sub-modulo';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubModuloService {

  private urlEndPoint: string = environment.apiURL + 'api';

  constructor(private http: HttpClient) { }

  getSubModuloIdModulo(id: number): Observable<SubModulo[]> {
    return this.http.get(`${this.urlEndPoint}/subModuloById/${id}`).pipe(
      map((response: any) => {
        (response as SubModulo[]).map(subModulos => {
          return subModulos;
        })
        return response
      })
    )
  }

}
