import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from './area';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private urlEndpoint = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }

  autocompleteListArea(term: string): Observable<Area[]> {
    if (!term) {
      term = "";
    }

    return this.http.get<Area[]>(`${this.urlEndpoint}/area/filtrar/${term}`).pipe(
      map((response: any) => {
        (response as Area[]).map(pers => {
          // console.log(pers)
          return pers;
        })
        // console.log(response)
        return response;
      })
    );
  }
}
