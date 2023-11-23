import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let role:string[] = next.data['role'] as string[];

    let blnContieneRol:boolean  = false;

    role.forEach(rol => {
      if (this.authService.hasRole(rol)) {
        blnContieneRol = true;
        return;
      }      
    });

    if(blnContieneRol){
      return true;
    }

    this.router.navigate(['/']);

    return false;
  }

}
