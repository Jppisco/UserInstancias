import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';
import { ITEMSPORPAGE, datos } from '../config';
import { ShowErrorService } from 'src/app/services/show-error.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.css']
})
export class ListUsuarioComponent implements OnInit {

  titulo = 'Lista de Usuarios';
  id_programa: string | null;
  id_instancia: string | null;
  usuario: any[] = [];
  itemsPerPage: number = ITEMSPORPAGE;
  currentPage: number = 1;
  currentPageItems: any[] = [];
  ExcelData: any
  inputDatos: null;

  ngOnInit(): void {
    this.getusu();
  }


  constructor(
    private _usuarioService: UsuarioService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private errores: ShowErrorService
  ) {
    this.id_programa = this.aRoute.snapshot.paramMap.get('id_programa');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');

  }
  ReadExcel(event: any) {
    console.log(this.inputDatos);

    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {

      let WorkBook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = WorkBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(WorkBook.Sheets[sheetNames[2]])

      try {
        this.ExcelData.map(element => {
          element.fechaCreacion = Date.now();
          element.fechaActualizacion = Date.now();
          this._usuarioService.agregarUsuarios(element);
          this.inputDatos = null
        });
        this.errores.showErrorCenter('Excel registrado con éxito', 'success')
        this.router.navigate(['/list-U']);
      } catch (error) {
        this.errores.showErrorCenter(error.code)
      }
    }
  }

  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.usuario.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.usuario.length / this.itemsPerPage);
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
  getusu() {
    if (this.id_programa === null) return this.getUsuarios()
    return this.getUsuarioId(this.id_programa)

  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista usuarios.xlsx');
  }

  handleSuccess(data: any[]) {
    this.usuario = data.map(datos)
    console.log(this.usuario)
    this.loadCurrentPageItems();
  }

  getUsuarioId(id_programa: string) {
    this._usuarioService.getUsuariosBy(id_programa).subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }
  getUsuarios() {
    this._usuarioService.getUsuarios().subscribe({
      next: (data) => this.handleSuccess(data),
    })
  }

  async eliminarUsuario(id: string) {
    const result = await Swal.fire({
      title: 'Estas Seguro?',
      text: "Quieres borrar un usuario de prueba?",
      icon: 'warning',
      iconColor: 'lightseagreen',
      showCancelButton: true,
      confirmButtonColor: 'lightseagreen',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar!'
    })
    if (!result.isConfirmed) return
    this._usuarioService.eliminarUsuario(id)
    console.log(id);
    console.log('usuario eliminado correctamente')
    Swal.fire({
      title: 'Eliminado!',
      text: "El Usuario ha sido eliminado!",
      icon: 'success',
      iconColor: 'lightseagreen',
      confirmButtonColor: 'lightseagreen',
      confirmButtonText: 'Ok',
    })
  }

}
