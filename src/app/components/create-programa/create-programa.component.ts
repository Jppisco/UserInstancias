import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaService } from 'src/app/services/programa.service';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-create-programa',
  templateUrl: './create-programa.component.html',
  styleUrls: ['./create-programa.component.css']
})
export class CreateProgramaComponent implements OnInit {
  //generamos variables
  createPrograma: FormGroup;
  id_instancia: string | null;
  id: string | null;
  titulo = 'Agregar programa';

  ngOnInit(): void {
    this.esEditar()
  }

  constructor(
    private _programaService: ProgramaService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private errores: ShowErrorService
  ) {
    this.createPrograma = this.fb.group({
      nombre: ['', Validators.required],
      pais: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }

  async agregarEditarProgramas() {
    if (this.id === null) {
      await this.agregarProgramas();
    } else {
      await this.editarProgramas(this.id);
    }
  }
  async agregarProgramas() {
    const programa = {
      id_instancia: this.id_instancia,
      id_programa: this.createPrograma.value.nombre.toLowerCase().replace(/ /g, '_'),
      nombre: this.createPrograma.value.nombre,
      pais: this.createPrograma.value.pais,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now()
    };

    try {
      await this._programaService.agregarProgramas(programa);
      this.errores.showErrorCenter('Programa registrado con éxito', 'success')
      this.router.navigate(['/list-P/', this.id_instancia]);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }

  async editarProgramas(id: string) {
    const programas = {
      nombre: this.createPrograma.value.nombre,
      pais: this.createPrograma.value.pais,
      fechaActualizacion: Date.now()
    };
    try {
      await this._programaService.actualizarPrograma(id, programas);
      this.errores.showErrorCenter('Programa actualizado con éxito', 'success')
      this.id_instancia == null ? this.router.navigate(['/list-P/']) : this.router.navigate(['/list-P/', this.id_instancia])



      console.log('/list-P/', this.id_instancia);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Programa';
      this._programaService.getPrograma(this.id).subscribe(data => {
        console.log(data)
        console.log(data.payload.data()['id_instancia']);
        this.createPrograma.setValue({
          nombre: data.payload.data()['nombre'],
          pais: data.payload.data()['pais'],
        })
      })
    }
  }

}
