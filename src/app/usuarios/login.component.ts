import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModuloService } from './modulo.service';
import { FuncionesComunes } from '../common/funciones-comunes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Inicie Sesión";
  titulo2: string = "Cambiar Contraseña";
  correo:string;
  usuario: Usuario = new Usuario();

  valorVer: boolean = true;
  valorVer2: boolean = true;

  blnGuardando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private moduloService:ModuloService,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.toastr.info('Su sesión ya está iniciada');
      this.router.navigate(['/']);
    }
  }

  login(): void {
    if(this.usuario.username == null || this.usuario.password == null) {
      this.toastr.warning('Usuario o Password vacíos','Ups');
      return;
    }

    this.blnGuardando = true;

    this.authService.login(this.usuario).subscribe(response => {
      this.moduloService.getModulosByUsername(this.usuario.username).subscribe(mod=>{
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        this.authService.guardarModulos(mod); 
        this.router.navigate(['/']);
        this.toastr.success('Ha iniciado sesión correctamente','Éxito');
        this.blnGuardando = false;
      },err=>{
        this.blnGuardando = false;
        this.toastr.error('Error al obtener informacion de inicio de sesión','Error');
      });
    }, err => {
      this.blnGuardando = false;
      if(err.status == 400 && err.error.error_description.includes('disabled')){
        this.toastr.warning('El usuario se encuentra inactivo', 'Inactivo');
      }else{
        this.toastr.error('Error al iniciar sesión','Error');
      }
    });
  }

  enviarCorreoResetPassword(): void{

    if(this.correo == null || this.correo == undefined){
      this.toastr.warning('Escriba el correo electrónico','Warning'); 
      return;     
    }

    if(!FuncionesComunes.validateEmail(this.correo)){
      this.toastr.warning('El correo electrónico es invalido','Warning'); 
      return;           
    }

    this.blnGuardando = true;

    this.authService.enviarCorreoChangePassword(this.correo).subscribe( rs => {
      this.toastr.success('Se envió un correo electrónico para restaurar su contraseña','Éxito');
      this.router.navigate(['/']);
      this.blnGuardando = false;
    }, err=>{
      if (err.status == 404) {
        this.toastr.warning('No se encontró el usuario', 'Warning');
      }
      if (err.status == 500) {
        this.toastr.error('Hubo un problema al enviar el correo', 'Error');
      }
      this.blnGuardando = false;
    });

  }

  changePassword(): void{
   this.valorVer = false
   this.valorVer2 = false
  }

  retroceder(): void{
    this.valorVer = true
    this.correo = undefined;
  }
}