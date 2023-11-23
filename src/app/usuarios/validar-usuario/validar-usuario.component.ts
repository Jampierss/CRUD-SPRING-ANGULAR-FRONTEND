import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { ChangedPassword } from '../cambiar-password/changedPassword';

@Component({
  selector: 'app-validar-usuario',
  templateUrl: './validar-usuario.component.html',
  styleUrls: ['./validar-usuario.component.css']
})
export class ValidarUsuarioComponent implements OnInit {

  token: string;
  password:string;
  rpassword:string;
  changedPassword: ChangedPassword;
  blnGuardando: boolean = true;

  constructor(
    private activedRouter: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  actualizar() {
    if(this.password == null || this.password == undefined){
      this.toastr.warning('Debe ingresar la contraseña ', 'Warning');
      return;
    }

    if(this.password.length < 6 ){
      this.toastr.warning('La contraseña debe tener como minimo 6 caracteres', 'Warning');
      return;
    }

    if(this.rpassword == null || this.rpassword == undefined ){
      this.toastr.warning('Debe de confirmar la contraseña', 'Warning');
      return;
    }

    if(this.password != this.rpassword){
      this.toastr.warning('Las contraseñas no coinciden', 'Warning');
      return;
    }

    this.changedPassword = new ChangedPassword();
    this.changedPassword.token = this.token;
    this.changedPassword.password = this.password;
    this.blnGuardando = true;

    this.authService.actualizarPassword(this.changedPassword).subscribe(response => {
      this.toastr.success('La contraseña se actualizó con éxito', 'Éxito');
      this.router.navigate(['/login']);
      this.blnGuardando = false;
    }, err => {
      this.toastr.error('Ocurrió un problema al actualizar la contraseña', 'Error');
      this.router.navigate(['/login']);
      this.blnGuardando = false;          
    });
  }

  comprobarToken(): void {
    this.activedRouter.params.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.authService.comprobarTokenToValidation(this.token).subscribe( rs=> {
        this.blnGuardando = false;
        },err=>{
          this.toastr.error('El link seleccionado expiró','Error')
          this.router.navigate(['/login']);
        })
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
