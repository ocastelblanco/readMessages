import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Item } from '../../models/item';

@IonicPage()
@Component({
    selector: 'page-list-master',
    templateUrl: 'list-master.html'
})
export class ListMasterPage {
    mensajes: Observable<any[]>;
    todosMensajes: Array;
    constructor(public navCtrl: NavController,
                 public db: AngularFireDatabase,
                 public afAuth: AngularFireAuth
                ) {
        const hoy = Date.now();
        this.mensajes = db.list('mensajes', ref => ref.orderByChild('date')).valueChanges().subscribe(mensaje => {
            this.todosMensajes = mensaje.reverse();
            this.todosMensajes.forEach((elemento, index) => {
                const fecha = new Date(elemento.date);
                const tiempo = hoy - fecha.getTime();
                const diferencia;
                if (tiempo < (120 * 60 * 1000)) {
                    diferencia = String(Math.ceil(tiempo / (60 * 1000)))+' min.';
                } else if (tiempo < (24 * 3600 * 1000)) {
                    diferencia = String(Math.floor(tiempo / (3600 * 1000)))+' horas';
                } else if (tiempo < (7 * 24 * 3600 * 1000)) {
                    diferencia = String(Math.floor(tiempo / (24 * 3600 * 1000)))+' días';
                } else if (tiempo < (4 * 7 * 24 * 3600 * 1000)) {
                    diferencia = String(Math.floor(tiempo / (7 * 24 * 3600 * 1000)))+' sem.';
                } else if (tiempo < (12 * 4 * 7 * 24 * 3600 * 1000)) {
                    diferencia = String(Math.floor(tiempo / (4 * 7 * 24 * 3600 * 1000)))+' meses';
                } else {
                    diferencia =String(Math.floor(tiempo / (12 * 4 * 7 * 24 * 3600 * 1000)))+' años';
                }
                this.todosMensajes[index].diferencia = diferencia;
            });
        });
    }
    abreMensaje(mensaje: Item) {
        this.navCtrl.push('ItemDetailPage', {
            item: mensaje
        });
    }
    logOut() {
        this.afAuth.auth.signOut();
        //this.navCtrl.push('LoginPage');
    }
}
