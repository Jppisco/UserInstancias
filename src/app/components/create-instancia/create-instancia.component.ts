import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanciaService } from 'src/app/services/instancia.service';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-create-instancia',
  templateUrl: './create-instancia.component.html',
  styleUrls: ['./create-instancia.component.css']
})
export class CreateInstanciaComponent implements OnInit {
  createInstancia: FormGroup;
  id: string | null;
  titulo = 'Agregar Instancia';

  ngOnInit(): void {
    this.esEditar();
  }

  constructor(
    private _instanciaService: InstanciaService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private errores: ShowErrorService
  ) {
    this.createInstancia = this.fb.group({
      nombre: ['', Validators.required],
      doc_id: ['', Validators.required],
      pais: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }
  async agregarEditarInstancias() {
    if (this.id) return await this.editarInstancia(this.id);
    await this.agregarInstancias();
  }
  async agregarInstancias() {
    const instancia = {
      id_instancia: this.createInstancia.value.nombre.toLowerCase().replace(/ /g, '_'),
      nombre: this.createInstancia.value.nombre,
      doc_id: this.createInstancia.value.doc_id,
      pais: this.createInstancia.value.pais,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now()
    };
    try {
      await this._instanciaService.agregarInstancia(instancia);
      this.errores.showErrorCenter('Instancia registrado con éxito', 'success')
      this.router.navigate(['/list-I']);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }
  async editarInstancia(id: string) {
    const instancia = {
      nombre: this.createInstancia.value.nombre,
      doc_id: this.createInstancia.value.doc_id,
      pais: this.createInstancia.value.pais,
      fechaActualizacion: Date.now()
    };
    try {
      await this._instanciaService.actualizarInstancia(id, instancia);
      this.errores.showErrorCenter('Instancia Actualizada con éxito', 'success')
      this.router.navigate(['/list-I']);
      console.log(instancia);
    } catch (error) {
      this.errores.showErrorCenter(error.code)
    }
  }
  async esEditar() {
    if (!this.id) return
    this.titulo = 'Editar instancia';
    await this._instanciaService.getInstancia(this.id).subscribe(data => {
      console.log(data);
      console.log(data.payload.data()['nombre']);
      this.createInstancia.setValue({
        nombre: data.payload.data()['nombre'],
        doc_id: data.payload.data()['doc_id'],
        pais: data.payload.data()['pais'],
      });
    })

  }
}
