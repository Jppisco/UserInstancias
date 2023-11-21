import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseCodeErrorEnum } from '../utils/firebase-code-error';

@Injectable({
  providedIn: 'root'
})
export class ShowErrorService {

  constructor() { }

  showErrorCenter(code: string, icon: any = 'error', position: any = 'center') {
    const mensaje = FirebaseCodeErrorEnum[code]
    return Swal.fire({
      position,
      icon,
      title: mensaje ? mensaje : code,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
