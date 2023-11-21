import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlukerService } from 'src/app/services/gluker.service';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-create-gluker',
  templateUrl: './create-gluker.component.html',
  styleUrls: ['./create-gluker.component.css']
})
export class CreateGlukerComponent implements OnInit {

  createGluker: FormGroup;
  id: string | null;
  titulo = 'Agregar Gluker';

  ngOnInit(): void {
    this.esEditar();
  }

  constructor(
    private glukerService: GlukerService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private errores: ShowErrorService
  ) {
    this.createGluker = this.fb.group({
      email: ['', Validators.required],
      rol: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }
  async agregarEditarGlukers() {
    if (this.id) return await this.editarGluker(this.id);
    await this.agregarGlukers();
  }
  async agregarGlukers() {
    const gluker = {
      email: this.createGluker.value.email,
      rol: this.createGluker.value.rol,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now()
    };
    try {
      await this.glukerService.agregarGluker(gluker);
      this.errores.showErrorCenter('Gluker registrado con éxito', 'success')
      this.router.navigate(['/list-G']);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }
  async editarGluker(id: string) {
    const gluker = {
      email: this.createGluker.value.email,
      rol: this.createGluker.value.rol,
      fechaActualizacion: Date.now()
    };
    try {
      await this.glukerService.actualizarGluker(id, gluker);
      this.errores.showErrorCenter('Gluker Actualizado con éxito', 'success')
      this.router.navigate(['/list-G']);
      console.log(gluker);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }
  async esEditar() {
    if (!this.id) return
    this.titulo = 'Editar Gluker';
    await this.glukerService.getGluker(this.id).subscribe(data => {
      console.log(data);
      console.log(data.payload.data()['nombre']);
      const { email, rol } = data.payload.data()
      this.createGluker.setValue({
        email,
        rol,
      });
    })

  }

}
