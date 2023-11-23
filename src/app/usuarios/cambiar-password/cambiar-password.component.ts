import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { ChangedPassword } from './changedPassword';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {

  token: string;
  password:string;
  rpassword:string;
  changedPassword: ChangedPassword = new ChangedPassword();
  blnGuardando : boolean = true;
  
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

    this.blnGuardando = true;
    this.changedPassword = new ChangedPassword();
    this.changedPassword.token = this.token;
    this.changedPassword.password = this.password;
    this.authService.actualizarPassword(this.changedPassword).subscribe(response => {
      this.blnGuardando = false;
      this.toastr.success('La contraseña se actualizó con éxito', 'Éxito');
      this.router.navigate(['/login']);
    }, err => {
      this.blnGuardando = false;
      this.toastr.error('Ocurrió un problema al actualizar la contraseña', 'Error');
    });

  }

  comprobarToken(): void {
    this.activedRouter.params.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.authService.comprobarToken(this.token).subscribe( rs=> {
          this.blnGuardando = false;
        },err=>{
          this.toastr.error('El enlace es inválido o ya expiró','Error');          
          this.router.navigate(['/login']);
        })
      } else {
        this.toastr.error('El enlace es inválido o ya expiró','Error');        
        this.router.navigate(['/login']);
      }
    });
  }
  
}
