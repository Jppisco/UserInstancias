import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowErrorService } from 'src/app/services/show-error.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  recuperarPassword: FormGroup
  obbCode = '';

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((param: any) => {
      console.log(param);
      if (param) {
        this.obbCode = param.oobCode
      }
    })
  }
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private errores: ShowErrorService
  ) {
    this.recuperarPassword = this.fb.group({
      password: ['', [Validators.required, , Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    })
  }

  recoverAccount() {
    const password = this.recuperarPassword.value.password;
    const repetirPassword = this.recuperarPassword.value.repetirPassword;

    if (password !== repetirPassword) {
      this.errores.showErrorCenter('las contraseñas deben ser iguales')
      return;
    }
    this.afAuth.confirmPasswordReset(this.obbCode, this.recuperarPassword.controls['password'].value)
    try {
      this.errores.showErrorCenter('Se ha cambiado tu contraseña correctamente. Inicia sesión con tu nueva contraseña', 'success')
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
    }
  }


}


