import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateInstanciaComponent } from './create-instancia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CreateInstanciaComponent', () => {
  let component: CreateInstanciaComponent;
  let fixture: ComponentFixture<CreateInstanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule//TODO: <-----
      ],
      declarations: [
        CreateInstanciaComponent
      ],
    }).compileComponents();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe retornar formulario invalido/falso', () => {
    const fixture = TestBed.createComponent(CreateInstanciaComponent);
    const app = fixture.componentInstance
    fixture.detectChanges() //TODO: <-----formulario invalido/solo estamos validando un solo campo

    const nombre = app.createInstancia.controls['nombre']
    nombre.setValue('sandra.perez')
    const doc_id = app.createInstancia.controls['doc_id']
    doc_id.setValue('sandra.perez')
    const pais = app.createInstancia.controls['pais']
    pais.setValue('sandra.perez')

    expect(app.createInstancia.invalid).toBeFalse(); //TODO: ✔
  });

  it('Debe retornar formulario valido/true', () => {
    const fixture = TestBed.createComponent(CreateInstanciaComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges(); //TODO: <-----formulario invalido/solo estamos validando un solo campo

    const nombre = app.createInstancia.controls['nombre'];
    nombre.setValue('Sandra'); // Establecer un valor válido para el campo "nombre"

    const doc_id = app.createInstancia.controls['doc_id'];
    doc_id.setValue('12345'); // Establecer un valor válido para el campo "doc_id"

    const pais = app.createInstancia.controls['pais'];
    pais.setValue('México'); // Establecer un valor válido para el campo "pais"

    // Verificar que el campo "nombre" sea válido
    expect(nombre.valid).toBeTrue();

    // Verificar que el campo "doc_id" sea válido
    expect(doc_id.valid).toBeTrue();

    // Verificar que el campo "pais" sea válido
    expect(pais.valid).toBeTrue();

    // Verificar que el formulario completo sea válido
    expect(app.createInstancia.valid).toBeTrue(); //TODO: ✔
  });


});
