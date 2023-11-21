import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstanciaService } from 'src/app/services/instancia.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ITEMSPORPAGE, datos } from '../config';
import { ShowErrorService } from 'src/app/services/show-error.service';




@Component({
  selector: 'app-list-instancia',
  templateUrl: './list-instancia.component.html',
  styleUrls: ['./list-instancia.component.css']
})
export class ListInstanciaComponent implements OnInit {

  titulo = 'Lista de instancias';
  allInstancias: any[] = [];
  itemsPerPage: number = ITEMSPORPAGE;
  currentPage: number = 1;
  currentPageItems: any[] = [];
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  ExcelData: any;
  inputDatos: null;

  ngOnInit() {
    this.getInstancias();
  }

  constructor(
    private _instanciaService: InstanciaService,
    private router: Router,
    private errores: ShowErrorService
  ) { }


  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {

      let WorkBook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = WorkBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(WorkBook.Sheets[sheetNames[0]])

      try {
        this.ExcelData.map(element => {
          // Verificar si el documento con el mismo ID ya existe en Firestore
          this._instanciaService.getInstanciasId(element.id_instancia).then(existingInstancia => {
            if (!existingInstancia) {
              element.fechaCreacion = Date.now();
              element.fechaActualizacion = Date.now();
              this._instanciaService.agregarInstancia(element);
              this.inputDatos = null
            } else {
              console.log('datos ya registrados');
            }
          });
        });
        this.errores.showErrorCenter('Excel registrado con éxito', 'success')
        this.router.navigate(['/list-I']);
      } catch (error) {
        this.errores.showErrorCenter(error.code)
      }
    }
  }


  limpiarInput() {
    this.fechaInicio = undefined;
    this.fechaFin = undefined
    this.getInstancias();

  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista instancias.xlsx');
  }
  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.allInstancias.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.allInstancias.length / this.itemsPerPage);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCurrentPageItems();
    }
  }
  nextPage() {
    const totalPages = this.totalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadCurrentPageItems();
    }
  }
  handleSuccess(data: any[]) {
    this.allInstancias = data.map(datos);
    console.log(this.allInstancias)
    this.loadCurrentPageItems()
  }

  async getInstancias() {
    await this._instanciaService.getInstancias().subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }
  async fechas() {
    const inicio = (new Date(this.fechaInicio)).getTime();
    const fin = (new Date(this.fechaFin)).getTime();
    await this._instanciaService.fecha(inicio, fin).subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }


  async eliminarInstancia(id: string) {
    const result = await Swal.fire({
      title: 'Estas Seguro?',
      text: "Esta Accion es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    })
    if (!result.isConfirmed) return
    await this._instanciaService.eliminarInstancia(id)
    console.log(id);
    console.log('instancia eliminada correctamente')
    Swal.fire(
      'Eliminado!',
      'La instancia ha sido borrada correctamente.',
      'success'
    )
  }

}
