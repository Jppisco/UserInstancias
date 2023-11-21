import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarUsuario: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private errores: ShowErrorService
  ) {
    this.recuperarUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void { }
  async recuperar() {
    const email = this.recuperarUsuario.value.correo;

    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.errores.showErrorCenter('Le enviamos un mensaje a su correo para restablecer la contraseña', 'info')
      this.router.navigate(['/login']);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    this.errores.showErrorCenter(error.code)
  }

}
