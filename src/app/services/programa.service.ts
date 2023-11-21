import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  constructor(private firestore: AngularFirestore) { }

  async agregarProgramas(programa: any): Promise<any> {
    await this.firestore.collection('programas').add(programa);
  }
  getProgramasId(id_programa: string): Promise<any> {
    return this.firestore.collection('programas', (ref) => ref.where('id_programa', '==', id_programa))
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
  getProgramas(): Observable<any> {
    return this.firestore.collection('programas', ref => ref.orderBy('id_instancia', 'asc')).snapshotChanges();
  }
  getProgramasBy(id_instancia: string): Observable<any> {
    return this.firestore.collection('programas', ref => {
      return ref
        .where('id_instancia', '==', id_instancia)
        .orderBy('id_instancia', 'asc');
    }).snapshotChanges();
  }
  fechas(inicio: number, fin: number, id_instancia: string): Observable<any> {
    return this.firestore.collection('programas', ref => {
      return ref
        .where('id_instancia', '==', id_instancia)
        .where('fechaCreacion', '>=', inicio)
        .where('fechaCreacion', '<=', fin)
    }).snapshotChanges();
  }
  fecha(inicio: number, fin: number): Observable<any> {
    return this.firestore.collection('programas', ref => {
      return ref
        .where('fechaCreacion', '>=', inicio)
        .where('fechaCreacion', '<=', fin)
    }).snapshotChanges();
  }

  async eliminarPrograma(id: string): Promise<any> {
    await this.firestore.collection('programas').doc(id).delete();
  }
  async actualizarPrograma(id: string, data: any): Promise<any> {
    await this.firestore.collection("programas").doc(id).update(data);
  }
  getPrograma(id: string): Observable<any> {
    return this.firestore.collection('programas').doc(id).snapshotChanges();
  }

}
