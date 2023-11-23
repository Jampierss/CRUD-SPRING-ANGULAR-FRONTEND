import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';
import { ChangedPassword } from '../cambiar-password/changedPassword';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  blnGuardandoDatos: boolean = false;
  nombreCompleto: string;
  usuario: string;
  correo: string;
  perfil: string;
  password1: string;
  password2: string;
  changedPassword: ChangedPassword;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public authService: AuthService){ }

  ngOnInit(): void {

    this.usuario = this.authService.usuario.username;
    this.correo = this.authService.usuario.email;
    this.perfil = this.authService.usuario.roles.join(' , ');
  }

  actualizar(): void {
    if(this.blnGuardandoDatos){
      return;
    }
    this.blnGuardandoDatos = true;

    if (this.password1==undefined || this.password1==null || this.password1.length == 0) {
      this.toastr.warning('Debe ingresar la nueva contraseña', 'Warning');
      this.blnGuardandoDatos = false;
      return;
    }

    if (this.password1.length < 6){
      this.toastr.warning('La nueva contraseña debe tener como minimo 6 caracteres', 'Warning');
      this.blnGuardandoDatos = false;
      return;      
    }    

    if (this.password2==undefined || this.password2==null || this.password2.length == 0) {
      this.toastr.warning('Debe volver a repetir la nueva contraseña', 'Warning');
      this.blnGuardandoDatos = false;
      return;
    }

    if (this.password1 != this.password2){
      this.toastr.warning('Las contraseñas no coinciden', 'Warning');
      this.blnGuardandoDatos = false;
      return;      
    } 

    this.changedPassword = new ChangedPassword();
    this.changedPassword.token = this.password1;
    this.changedPassword.password = this.password1;
    this.authService.actualizarPasswordPerfil(this.changedPassword, this.authService.usuario.id).subscribe(response => {
      this.toastr.success('La contraseña se actualizó con éxito', 'Éxito');
      this.router.navigate(['/']);
      this.blnGuardandoDatos = false;
    }, err => {
      this.toastr.error('Ocurrió un problema al actualizar la contraseña', 'Error');
      this.blnGuardandoDatos = false;
    });
  }

  actualizarDatos(): void {
    if(this.blnGuardandoDatos){
      return;
    }
    this.blnGuardandoDatos = true;

    if (this.correo == undefined || this.correo == null || this.correo.length == 0){
      this.toastr.warning('Debe completar el campo del correo', 'Warning'); 
      this.blnGuardandoDatos = false;
      return;         
    }

    if(!FuncionesComunes.validateEmail(this.correo)){
      this.toastr.warning('El formato del correo es invalido', 'Warning'); 
      this.blnGuardandoDatos = false;
      return; 
    }
    
    this.changedPassword = new ChangedPassword();
    this.changedPassword.correoNuevo = this.correo;
    this.authService.actualizarDatosPerfil(this.changedPassword, this.authService.usuario.id).subscribe(response => {   
      this.authService.usuario.email = this.correo;
      this.authService.guardarUsuarioLocalStorage();
      this.toastr.success('El correo se actualizó con éxito', 'Éxito');
      this.blnGuardandoDatos = false;
    }, err => {
      this.toastr.error('Ocurrió un problema al actualizar el correo', 'Error');
      this.blnGuardandoDatos = false;
    });
  }
}
