import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GoogleAuthProvider } from '@firebase/auth';
import { ShowErrorService } from './show-error.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private errores: ShowErrorService) { }


  // loginGoogle() {
  //   return this.authLogin(new GoogleAuthProvider());
  // }

  // async authLogin(provider: any) {
  //   try {
  //     const result = await this.afAuth.signInWithPopup(provider);
  //     const user = result.user;
  //     const idToken = await user.getIdToken();
  //     const userData = {
  //       uid: user.uid,
  //       correo: user.email,
  //       token: idToken
  //     };
  //     // No es necesario convertir userData a cadena JSON antes de almacenarlo en sessionStorage
  //     sessionStorage.setItem('userData', JSON.stringify(userData));
  //     this.validateEmail(user.email).subscribe(data => {

  //       if (data.length == 0) {
  //         sessionStorage.clear()
  //         return this.errores.showErrorCenter('Correo Invalido')
  //       };
  //       console.log(data);

  //       // console.log(data[0].payload.doc.data()['rol'])
  //       const { rol } = data[0].payload.doc.data()
  //       console.log(rol)
  //       sessionStorage.setItem('rol', rol);
  //       this.router.navigate(['/list-I']);
  //       return 0;

  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // validateEmail(email: string): Observable<any> {
  //   return this.firestore.collection('userInfo', ref => ref.where('email', '==', email)).snapshotChanges();
  // }
  loginGoogle() {
    return this.authLogin(new GoogleAuthProvider())
  }
  async authLogin(provider: any) {
    try {
      const result = await this.afAuth.signInWithPopup(provider)
      const user = result.user;
      const idToken = await user.getIdToken()
      const userData = {
        uid: user.uid,
        correo: user.email,
        token: idToken
      };
      const userDataString = JSON.stringify(userData);

      // Almacena la cadena JSON en sessionStorage
      sessionStorage.setItem('userData', userDataString);
      this.router.navigate(['/list-I']);

    } catch (error) {
      console.log(error);
    }
  }

  getGlukerId(email: string): Promise<any> {
    return this.firestore.collection('userInfo', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return doc.data();
        } else {
          return null; // No se encontró ninguna instancia con ese id_instancia
        }
      })
      .catch((error) => {
        console.error('Error al obtener Gluker por email:', error);
        return null;
      });
  }

  addGluker(Gluker: any): Promise<any> {
    return this.firestore.collection('userInfo').add(Gluker);
  }

  getUserInfo(): Observable<any> {
    return this.firestore.collection('userInfo', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  deleteUserInfo(id: string): Promise<any> {
    return this.firestore.collection('userInfo').doc(id).delete();
  }

  agregarUsuarios(instancia: any): Promise<any> {
    return this.firestore.collection('usuarios').add(instancia);
  }

  eliminarUsuario(id: string): Promise<any> {
    return this.firestore.collection('usuarios').doc(id).delete();
  }

  actualizarUsuario(id: string, data: any): Promise<any> {
    return this.firestore.collection("usuarios").doc(id).update(data);
  }

  getUsuario(id: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(id).snapshotChanges();
  }

  getUsuariosBy(id_programa: string): Observable<any> {
    return this.firestore.collection('usuarios', ref => ref.where('id_programa', '==', id_programa)).snapshotChanges();
  }

  getUsuarios(): Observable<any> {
    return this.firestore.collection('usuarios', ref => ref.orderBy('fechaCreacion', 'desc')).snapshotChanges();
  }

}
