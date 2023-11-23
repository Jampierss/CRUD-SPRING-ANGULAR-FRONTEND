import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuarios/models/usuario';
import { Modulo } from '../usuarios/models/modulo';
import { SubModulo } from '../usuarios/models/sub-modulo';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  innerWidth: any;
  usuario: Usuario;
  modulos : Modulo[];
  titulo: string;

  constructor(
    public _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { 
      const navEndEvents$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) =>{
        this.titulo = this.route.root.firstChild.snapshot.data.menu?this.route.root.firstChild.snapshot.data.menu:'';
      })
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.usuario = this._authService.usuario;
    this.modulos = this._authService.modulos;
    
    this.router.events.subscribe((val) => {
      this.usuario = this._authService.usuario;
      this.modulos = this._authService.modulos;
    });       
  }

  isAuthenticated():boolean{
    return this._authService.isAuthenticated();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  logout(): void {
    this._authService.logout();
    this.router.navigate(['/login']);
  }

  openNav() {
    if (this.innerWidth > 576) {
      document.getElementById("myNav").style.width = "25%";
    } else {
      document.getElementById("myNav").style.width = "100%";
    } 
  }

  closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }

  abrirSubMenu(mod:Modulo) {
    this.modulos.forEach(m =>{
      if(m.id == mod.id){
        m.abierto = !m.abierto;
      } else {
        m.abierto = false;
      }
      m.subModulos.forEach(s=>{
        s.abierto = false;
      })
    });
  }

  abrirSubSubMenu(mod:Modulo, sub:SubModulo) {
    this.modulos.forEach(m=>{
      if(m.id == mod.id){
        m.subModulos.forEach(s=>{
          if(s.id = sub.id){
            s.abierto = !s.abierto;
          } else {
            s.abierto = false;
          }
        });
      } else {
        m.subModulos.forEach(s=>{
          s.abierto = false;
        });        
      }
    });
  }
}