import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class InstanciaService {

  constructor(private firestore: AngularFirestore) {
  }

  //hacemos una metodo para almacenar los datos en la collecion
  async agregarInstancia(instancia: any): Promise<any> {
    return this.firestore.collection('instancias').add(instancia);
  }

  getInstanciasId(id_instancia: string): Promise<any> {
    return this.firestore.collection('instancias', (ref) => ref.where('id_instancia', '==', id_instancia))
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
        console.error('Error al obtener instancia por id_instancia:', error);
        return null;
      });
  }
  //hacemos una consulta a la base de datos y ordenamos por fecha de creacion
  getInstancias(): Observable<any> {
    return this.firestore.collection('instancias', ref => ref.orderBy('id_instancia', 'asc')).snapshotChanges();
  }

  fecha(inicio: number, fin: number): Observable<any> {
    return this.firestore.collection('instancias', ref => {
      return ref
        .where('fechaCreacion', '>=', inicio)
        .where('fechaCreacion', '<=', fin)
    }).snapshotChanges();
  }
  //hacemos una metodo recibe el id lo valida y lo elimina
  async eliminarInstancia(id: string): Promise<any> {
    await this.firestore.collection('instancias').doc(id).delete();
  }
  //hacemos un metodo que nos va a retornar todos los datos dependiendo el id
  getInstancia(id: string): Observable<any> {
    return this.firestore.collection('instancias').doc(id).snapshotChanges();
  }
  //hacemos un metodo que va actualizar una instancia por el id
  async actualizarInstancia(id: string, data: any): Promise<any> {
    await this.firestore.collection("instancias").doc(id).update(data);
  }


}
