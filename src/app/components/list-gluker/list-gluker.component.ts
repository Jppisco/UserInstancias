import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ITEMSPORPAGE, datos } from '../config';
import { ShowErrorService } from 'src/app/services/show-error.service';

@Component({
  selector: 'app-list-gluker',
  templateUrl: './list-gluker.component.html',
  styleUrls: ['./list-gluker.component.css']
})
export class ListGlukerComponent {
  userInfoList: any[] = [];
  itemsPerPage: number = ITEMSPORPAGE;
  currentPage: number = 1;
  currentPageItems: any[] = [];
  ExcelData: any;
  inputData: null;
  titulo = 'Lista Glukers';

  constructor(
    private _serviceUserInfo: UsuarioService,
    private errores: ShowErrorService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

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
          this. _serviceUserInfo.getGlukerId(element.email).then(existingGluker => {
            if (!existingGluker) {
              element.fechaCreacion = Date.now();
              element.fechaActualizacion = Date.now();
              this. _serviceUserInfo.addGluker(element);
              this.inputData = null
            } else {
              console.log('datos ya registrados');
            }
          });
        });
        this.errores.showErrorCenter('Excel registrado con éxito', 'success')
        this.router.navigate(['/list-G']);
      } catch (error) {
        this.errores.showErrorCenter(error.code)
      }
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista glukers.xlsx');
  }

  handleSuccess(data: any[]) {
    this.userInfoList = data.map(datos);
    console.log(this.userInfoList)
    this.loadCurrentPageItems()
  }

  async getUserInfo() {
    await this._serviceUserInfo.getUserInfo().subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }


  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.userInfoList.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.userInfoList.length / this.itemsPerPage);
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

  async deleteUserInfo(id: string) {
    const result = await Swal.fire({
      title: 'Estas Seguro?',
      text: "Esta Accion es irreversible!",
      icon: 'warning',
      iconColor: 'lightseagreen',
      showCancelButton: true,
      confirmButtonColor: 'lightseagreen',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar!',
    })
    if (!result.isConfirmed) return
    await this._serviceUserInfo.deleteUserInfo(id)
    console.log(id);
    console.log('Gluker eliminada correctamente')
    Swal.fire({
      title: 'Eliminado!',
      text: "El Gluker ha sido eliminado!",
      icon: 'success',
      iconColor: 'lightseagreen',
      confirmButtonColor: 'lightseagreen',
      confirmButtonText: 'Ok',
    })
  }

}
