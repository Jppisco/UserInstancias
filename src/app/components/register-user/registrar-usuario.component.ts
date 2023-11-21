import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ShowErrorService } from 'src/app/services/show-error.service';
@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {
  registrarUsuario: FormGroup;


  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private errores: ShowErrorService
  ) {
    this.registrarUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  async registrar() {
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassword = this.registrarUsuario.value.repetirPassword;
    console.log(this.registrarUsuario);
    // Valida que las dos contraseñas sean iguales
    if (password !== repetirPassword) {
      this.errores.showErrorCenter('las contraseñas deben ser iguales')
      return;
    }

    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);

      // Llama el método para verificar si el correo ya ha sido validado
      this.verificarCorreo();
    } catch (error) {
      this.handleError(error);
    }
  }



  handleError(error) {
    this.errores.showErrorCenter(error.code)

  }

  //metodo para verificar el corre
  async verificarCorreo() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        this.errores.showErrorCenter('Le enviamos un correo electrónico para su verificación', 'info')
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'info',
        //   title: 'Le enviamos un correo electrónico para su verificación',
        //   showConfirmButton: false,
        //   timer: 3000
        // });
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.handleError(error);
    }
  }


}
