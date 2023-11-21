import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaService } from 'src/app/services/programa.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ITEMSPORPAGE, datos } from '../config';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-list-programa',
  templateUrl: './list-programa.component.html',
  styleUrls: ['./list-programa.component.css']
})
export class ListProgramaComponent implements OnInit {

  titulo = 'Lista de programas';
  id_instancia: string | null;
  programa: any[] = [];
  itemsPerPage: number = ITEMSPORPAGE;
  currentPage: number = 1;
  currentPageItems: any[] = [];
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  ExcelData: any;
  inputDatos: null;


  ngOnInit(): void {
    this.getpro();
  }



  constructor(
    private _programaService: ProgramaService,
    private aRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private errores: ShowErrorService
  ) {
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }
  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {

      let WorkBook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = WorkBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(WorkBook.Sheets[sheetNames[1]])

      try {
        this.ExcelData.map(element => {
          // Verificar si el documento con el mismo ID ya existe en Firestore
          this._programaService.getProgramasId(element.id_programa).then(existingInstancia => {
            if (!existingInstancia) {
              element.fechaCreacion = Date.now();
              element.fechaActualizacion = Date.now();
              this._programaService.agregarProgramas(element);
              this.inputDatos = null

            } else {
              console.log('datos ya registrados');

            }
          });
        });
        this.errores.showErrorCenter('Excel registrado con éxito', 'success')
        this.router.navigate(['/list-P']);
      } catch (error) {
        this.errores.showErrorCenter(error.code)
      }
    }
  }

  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.programa.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.programa.length / this.itemsPerPage);
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
  getpro() {
    if (this.id_instancia === null) return this.getPrograma()
    this.getProgramaId(this.id_instancia)
  }
  limpiarInput() {
    this.fechaInicio = undefined;
    this.fechaFin = undefined;
    this.getpro();
    return;
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista programa.xlsx');
  }
  handleSuccess(data: any[]) {
    this.programa = data.map(datos)
    console.log(this.programa)
    this.loadCurrentPageItems();
  }
  getProgramaId(id_instancia: string) {
    this._programaService.getProgramasBy(id_instancia).subscribe({
      next: (data) => this.handleSuccess(data)
    })
  }
  getPrograma() {
    this._programaService.getProgramas().subscribe({
      next: (data) => this.handleSuccess(data)
    })
  }
  async fechas() {
    const id_instancias = this.id_instancia
    const inicio = (new Date(this.fechaInicio)).getTime();
    const fin = (new Date(this.fechaFin)).getTime();
    console.log(inicio, fin);

    await this._programaService.fechas(inicio, fin, id_instancias).subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }
  async fechasSinId() {
    const inicio = (new Date(this.fechaInicio)).getTime();
    const fin = (new Date(this.fechaFin)).getTime();
    console.log('sin id');

    await this._programaService.fecha(inicio, fin).subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }

  async eliminarPrograma(id: string) {
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
    await this._programaService.eliminarPrograma(id)
    console.log(id);
    console.log('programa eliminada correctamente')
    Swal.fire(
      'Eliminado!',
      'El programa ha sido borrada correctamente.',
      'success'
    )
  }


}
