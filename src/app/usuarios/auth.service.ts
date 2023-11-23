import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './models/usuario';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChangedPassword } from './cambiar-password/changedPassword';
import { ToastrService } from 'ngx-toastr';
import { Modulo } from './models/modulo';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _modulos: Modulo[];
  private _token: string;
  private urlEndPoint: string =  environment.apiURL + 'api/usuarios';
  private urlEndPoint2: string = environment.apiURL + 'api/user/resetPassword';
  private urlEndPoint3: string = environment.apiURL + 'api/user/changedPassword';
  private urlEndPoint4: string = environment.apiURL + 'api/user';
  private urlEndPoint5: string = environment.apiURL + 'api/usuario';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && localStorage.getItem("usuario") != null) {
      this._usuario = JSON.parse(localStorage.getItem("usuario")) as Usuario;
      return this._usuario;
    } else {
      return new Usuario();
    }
  }

  public get modulos(): Modulo[] {
    if (this._modulos != null) {
      return this._modulos;
    } else if (this._modulos == null && localStorage.getItem("modulos") != null) {
      this._modulos = JSON.parse(localStorage.getItem("modulos")) as Modulo[];
      return this._modulos;
    } else {
      return [];
    }
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem("token") != null) {
      this._token = localStorage.getItem("token");
      return this._token;
    } else {
      return null;
    }
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint5}/${id}`).pipe(
      map(response => {

        response.rolesDetallado = [];
        response.mostrarRoles = "";
        for (let i = 0; i < response.roles.length; i++) {
          response.rolesDetallado.push(response.roles[i].nombreDetallado)
        }

        response.mostrarRoles = response.rolesDetallado.join(', ')
        return response
      }),
      catchError(e => {

        return throwError(e);
      })
    );
  }

  getComboBox(): Observable<String[]> {
    return this.http.get<String[]>(`${this.urlEndPoint}/combo_box`);
  }

  enviarCorreoChangePassword(correo: string): Observable<string> {
    return this.http.post<any>(this.urlEndPoint2, correo, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  comprobarToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint4}/comprobar/${token}`).pipe(
      catchError(e => {

        if (e.status == 406) {
          this.router.navigate(['/login'])

        }

        return throwError(e);
      })
    );
  }

  comprobarTokenToValidation(token: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint4}/validarUsuario/${token}`).pipe(
      catchError(e => {

        if (e.status == 406) {
          this.router.navigate(['/login'])

        }

        return throwError(e);
      })
    );
  }

  getToken(token: string): Observable<string> {
    return this.http.get<any>(`${this.urlEndPoint3}/${token}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/login'])
        }
        return throwError(e);
      })
    );
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = environment.apiURL + 'oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Basic ' + credenciales });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {

    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.id = payload.id;
    this._usuario.nombreCompleto = payload.nombre_completo;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;

    this._usuario.rolesDetallado = payload.role_detallado;
    this._usuario.rolesAuthorities = payload.authorities;

    this._usuario.roles = payload.roles;
    this.guardarUsuarioLocalStorage();
  }

  guardarUsuarioLocalStorage():void{
    localStorage.setItem("usuario", JSON.stringify(this._usuario));
  }
  
  guardarToken(accessToken: string): void {
    this._token = accessToken;
    localStorage.setItem("token", this._token);
  }

  guardarModulos(modulos: Modulo[]): void {
    this._modulos = modulos;
    localStorage.setItem("modulos", JSON.stringify(this._modulos));
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    } else {
      return null;
    }
  }

  actualizarPassword(changedPassword: ChangedPassword): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint4}/changedPassword/${changedPassword.token}/${changedPassword.password}`, changedPassword).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
        }
        return throwError(e);
      })
    );
  }

  actualizarPasswordPerfil(changedPassword: ChangedPassword, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint4}/password/${id}`, changedPassword).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
        }
        return throwError(e);
      })
    );
  }

  actualizarDatosPerfil(changedPassword: ChangedPassword, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint4}/datos/${id}`, changedPassword).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {

        }

        return throwError(e);
      })
    );
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }

    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.rolesAuthorities.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    this._modulos = null;
    localStorage.clear();
  }

  getImage(src:string): Observable<string>{
    if(src==null || src==undefined || src.length == 0 || src.match(new RegExp(/^(http|https):\/\//g))){
      return this.http.get(src, {responseType: "blob" }).pipe(
        map((result) => {
          let base64Image =  URL.createObjectURL(result);
          return this.sanitizer.bypassSecurityTrustUrl( base64Image ) as string;
        }),
        catchError(e => {
          if (e.status != 401) {
            console.error(e);
          }
          return 'assets/imagenes/searchColor.png';
          }
        )
      );
    } else {
      return of(src);
    }    
  }
}