import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInstanciaComponent } from './components/list-instancia/list-instancia.component';
import { CreateInstanciaComponent } from './components/create-instancia/create-instancia.component';
import { ListUsuarioComponent } from './components/list-usuario/list-usuario.component';
import { CreateUsuarioComponent } from './components/create-usuario/create-usuario.component';
import { RegistrarUsuarioComponent } from './components/register-user/registrar-usuario.component';
import { LoginComponent } from './components/login/login.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { CreateProgramaComponent } from './components/create-programa/create-programa.component';
import { ListProgramaComponent } from './components/list-programa/list-programa.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ListGlukerComponent } from './components/list-gluker/list-gluker.component';
import { CreateGlukerComponent } from './components/create-gluker/create-gluker.component';
import { glukerGuard } from './guards/gluker.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegistrarUsuarioComponent },
  { path: 'verificar-correo', component: VerificarCorreoComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'list-I', component: ListInstanciaComponent, canActivate: [AuthGuard], },
  { path: 'create-I', component: CreateInstanciaComponent, canActivate: [AuthGuard], },
  { path: 'edit/:id', component: CreateInstanciaComponent, canActivate: [AuthGuard], },
  { path: 'list-P', component: ListProgramaComponent, canActivate: [AuthGuard], },
  { path: 'create-P/:id_instancia', component: CreateProgramaComponent, canActivate: [AuthGuard], },
  { path: 'list-P/:id_instancia', component: ListProgramaComponent, canActivate: [AuthGuard], },
  { path: 'edit-P/:id/:id_instancia', component: CreateProgramaComponent, canActivate: [AuthGuard], },
  { path: 'edit-P/:id', component: CreateProgramaComponent, canActivate: [AuthGuard], },
  { path: 'list-U', component: ListUsuarioComponent, canActivate: [AuthGuard], },
  { path: 'list-U/:id_programa/:id_instancia', component: ListUsuarioComponent, canActivate: [AuthGuard], },
  { path: 'create-U/:id_programa/:id_instancia', component: CreateUsuarioComponent, canActivate: [AuthGuard], },
  { path: 'edit-U/:id/:id_programa/:id_instancia', component: CreateUsuarioComponent, canActivate: [AuthGuard], },
  { path: 'edit-U/:id', component: CreateUsuarioComponent, canActivate: [AuthGuard], },
  { path: 'list-G', component: ListGlukerComponent, canActivate: [glukerGuard], },
  { path: 'create-G', component: CreateGlukerComponent, canActivate: [glukerGuard], },
  { path: 'edit-G/:id', component: CreateGlukerComponent, canActivate: [glukerGuard], },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
