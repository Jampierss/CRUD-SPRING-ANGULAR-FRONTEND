import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { ImageViewerModule } from 'ng2-image-viewer';
import {MatChipsModule} from '@angular/material/chips';

import localeES from '@angular/common/locales/es';
//Pipes
import { AuthImagePipe } from './common/authImage.pipe';
import { TrustHtmlPipe } from './common/trust-html-pipe.pipe';
import { NumberFormatPipe } from './common/numberFormat.pipe';
import { NumberFormatWithoutDecimalsPipe } from './common/numberFormatWithoutDecimals.pipe';
//Directivas
import { ClickCursorDirective } from './common/click.cursor.directive';
import { OnlyNumbersDirective } from './common/only-numbers.directive';
import { NumbersTwoDecimalsDirective } from './common/numbers-two-decimals.directive';
import { NumbersTwoDecimalsWithCommasDirective } from './common/numbers-two-decimals-with-commas.directive';

//Componentes comunes
import { AppComponent } from './app.component';
import { SelectAutocompleteComponent } from './common/select-autocomplete/select-autocomplete.component';
import { HeaderComponent } from './header/header.component';
import { ModalSiNoComponent } from './common/modal-si-no/modal-si-no.component';
import { PaginatorComponent } from './paginator/paginator.component';

//Guards
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';

//Interceptor
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';

//Componentes
import { LoginComponent } from './usuarios/login.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { CambiarPasswordComponent } from './usuarios/cambiar-password/cambiar-password.component';
import { ValidarUsuarioComponent } from './usuarios/validar-usuario/validar-usuario.component';
import { ParametroComponent } from './auxiliares/parametro/parametro.component';
import { TablaAuxiliarComponent } from './auxiliares/tabla-auxiliar/tabla-auxiliar.component';

//Services
import { AuthService } from './usuarios/auth.service';
import { ModuloService } from './usuarios/modulo.service';
import { SubModuloService } from './usuarios/sub-modulo.service';
import { ParametroService } from './auxiliares/parametro/parametro.service';
import { TablaAuxiliarService } from './auxiliares/tabla-auxiliar/tabla-auxiliar.service';
import { ModalVisorFotoComponent } from './common/modal-visor-foto/modal-visor-foto.component';
import { ModalVisorVideoComponent } from './common/modal-visor-video/modal-visor-video.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { CargoComponent } from './maestros/cargo/cargo.component';
import { ClienteComponent } from './maestros/cliente/cliente.component';
import { SubareaComponent } from './maestros/subarea/subarea.component';

registerLocaleData(localeES, 'es-Pe');

const routes: Routes = [
  //Login
  {path: 'login', component: LoginComponent , data: {title:'Login | Farmacia Universal', menu:'Seguridad  |  Login'}},
  {path: 'user/miperfil', component: PerfilComponent, canActivate: [AuthGuard], data: {title:'Mi Perfil | Farmacia Universal', menu:'Seguridad  |  Mi Perfil'}},
  {path: 'user/changedPassword/:token', component: CambiarPasswordComponent, data: {title:'Cambiar contraseña | Farmacia Universal', menu:'Seguridad  |  Cambiar Contraseña'}},
  {path: 'user/validarUsuario/:token', component: ValidarUsuarioComponent, data: {title:'Validar Usuario | Farmacia Universal', menu:'Seguridad  |  Validar Usuario'}},

  //Auxiliares
  {path: 'parametros', component: ParametroComponent, canActivate: [AuthGuard, RoleGuard], data: {role:['ROLE_TI'], title:'Parametros | Farmacia Universal', menu:'Auxiliar  |  Parametros Auxiliares  |  Parametros'}},
  {path: 'tablaAuxiliar', component: TablaAuxiliarComponent , canActivate: [AuthGuard, RoleGuard], data: {role:['ROLE_TI'], title:'Tabla Auxiliar | Farmacia Universal', menu:'Auxiliar  |  Parametros Auxiliares  |  Tabla Auxiliar'}},

  //Maetros
  {path: 'cargo', redirectTo: 'cargo/0', pathMatch: 'full', data: {role:['ROLE_TI'], title:'Cargos', menu:'Maestros  |  Cargo'}},
  {path: 'cargo/:page', component: CargoComponent, canActivate: [AuthGuard, RoleGuard], data: {role:['ROLE_TI'], title:'Cargos', menu:'Maestros  |  Cargo'}},

  {path: 'cliente', redirectTo: 'cliente/0', pathMatch: 'full', data: {role:['ROLE_TI'], title:'Clientes', menu:'Maestros  |  Cliente'}},
  {path: 'cliente/:page', component: ClienteComponent, canActivate: [AuthGuard, RoleGuard], data: {role:['ROLE_TI'], title:'Clientes', menu:'Maestros  |  Cliente'}},

  {path: 'subarea', redirectTo: 'subarea/0', pathMatch: 'full'},
  {path: 'subarea/:page', component: SubareaComponent},

  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    //Pipes
    TrustHtmlPipe,
    AuthImagePipe,
    NumberFormatPipe,
    NumberFormatWithoutDecimalsPipe,
    //Directivas
    ClickCursorDirective,
    OnlyNumbersDirective,
    NumbersTwoDecimalsDirective,
    NumbersTwoDecimalsWithCommasDirective,
    //Componentes comunes
    SelectAutocompleteComponent,
    HeaderComponent,
    ModalSiNoComponent,
    PaginatorComponent,
    //Componentes
    LoginComponent,
    PerfilComponent,
    CambiarPasswordComponent,
    ValidarUsuarioComponent,
    ParametroComponent,
    TablaAuxiliarComponent,
    ModalVisorFotoComponent,
    ModalVisorVideoComponent,
    CargoComponent,
    ClienteComponent,
    SubareaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    DragDropModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    }),
    ToastrModule.forRoot({
      closeButton:true,
      timeOut:3000,
      extendedTimeOut:1000,
      progressBar:true,
      progressAnimation:'decreasing',
      positionClass: 'toast-top-right',
      tapToDismiss:true,
      maxOpened:1,
      preventDuplicates:true,
      autoDismiss:true
    }),
    ImageViewerModule,
    MatChipsModule,
    NgImageSliderModule
  ],
  exports:[
    MatIconModule,
  ],
  providers: [
    AuthService,
    ModuloService,
    SubModuloService,
    ParametroService,
    TablaAuxiliarService,
    { provide: LOCALE_ID, useValue: 'es-Pe' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  entryComponents: [
    ModalSiNoComponent,
    ModalVisorFotoComponent,
    ModalVisorVideoComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
