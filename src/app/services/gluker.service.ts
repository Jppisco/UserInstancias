import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlukerService {

  constructor(private firestore: AngularFirestore) { }

  async agregarGluker(gluker: any): Promise<any> {
    return this.firestore.collection('userInfo').add(gluker);
  }
  getGlukers(): Observable<any> {
    return this.firestore.collection('userInfo', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }
  //hacemos una metodo recibe el id lo valida y lo elimina
  async eliminarGluker(id: string): Promise<any> {
    await this.firestore.collection('userInfo').doc(id).delete();

  }
  //hacemos un metodo que nos va a retornar todos los datos dependiendo el id
  getGluker(id: string): Observable<any> {
    return this.firestore.collection('userInfo').doc(id).snapshotChanges();
  }
  //hacemos un metodo que va actualizar una instancia por el id
  async actualizarGluker(id: string, data: any): Promise<any> {
    await this.firestore.collection("userInfo").doc(id).update(data);
  }
}
