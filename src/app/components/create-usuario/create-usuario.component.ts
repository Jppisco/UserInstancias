import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ShowErrorService } from 'src/app/services/show-error.service';


@Component({
  selector: 'app-create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class CreateUsuarioComponent implements OnInit {
  createUsuario: FormGroup;
  id_programa: string | null;
  id_instancia: string | null;
  id: string | null;
  titulo = 'Agregar Usuario';
  myForm: any;

  ngOnInit(): void {
    this.esEditar()
  }

  constructor(private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private errores: ShowErrorService
  ) {
    this.createUsuario = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      puntos: ['', Validators.required],
      cuentaActiva: ['', Validators.required],
    })
    this.id_programa = this.aRoute.snapshot.paramMap.get('id_programa');
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }
  agregarEditarUsuarios() {
    if (this.id === null) {
      return this.agregarUsuarios();
    } else {
      return this.editarUsuarios(this.id);
    }
  }
  async agregarUsuarios() {
    const usuarios = {
      id_programa: this.id_programa,
      usuario: this.createUsuario.value.usuario,
      clave: this.createUsuario.value.clave,
      puntos: this.createUsuario.value.puntos,
      cuentaActiva: this.createUsuario.value.cuentaActiva,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now()
    };
    try {
      await this._usuarioService.agregarUsuarios(usuarios);
      this.errores.showErrorCenter('Usuario registrado con éxito', 'success')

      this.router.navigate(['/list-U'])

    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }

  }
  async editarUsuarios(id: string) {
    const usuarios = {
      usuario: this.createUsuario.value.usuario,
      clave: this.createUsuario.value.clave,
      puntos: this.createUsuario.value.puntos,
      cuentaActiva: this.createUsuario.value.cuentaActiva,
      fechaActualizacion: Date.now()
    };
    try {
      await this._usuarioService.actualizarUsuario(id, usuarios);
      this.errores.showErrorCenter('Usuarios Actualizado con éxito', 'success')
      this.id_programa == null ? this.router.navigate(['/list-U/']) : this.router.navigate(['/list-U/', this.id_programa, this.id_instancia])

    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Usuario';
      this._usuarioService.getUsuario(this.id).subscribe(data => {
        console.log(data)
        console.log(data.payload.data()['id_programa']);
        this.createUsuario.setValue({
          usuario: data.payload.data()['usuario'],
          clave: data.payload.data()['clave'],
          puntos: data.payload.data()['puntos'],
          cuentaActiva: data.payload.data()['cuentaActiva'],
        })
      })
    }
  }

}
