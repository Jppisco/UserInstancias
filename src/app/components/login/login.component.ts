import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ShowErrorService } from 'src/app/services/show-error.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private errores: ShowErrorService
  ) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void { }
  loginGoogle() {
    this.userService.loginGoogle()
  }

  async login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);

      if (!userCredential.user?.emailVerified) return this.router.navigate(['/verificar-correo']);
      const userData = await this.getUserData(userCredential.user);
      this.saveUserData(userData);
      return this.router.navigate(['/list-I']);

    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserData(user) {
    const idToken = await user.getIdToken();
    return {
      uid: user.uid,
      correo: user.email,
      token: idToken
    };
  }

  saveUserData(userData) {
    const userDataString = JSON.stringify(userData);
    sessionStorage.setItem('userData', userDataString);
  }

  handleError(error) {
    this.errores.showErrorCenter(error.code)
  }


}
