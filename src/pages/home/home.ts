import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, Alert } from 'ionic-angular';

//SERVICIOS
import { UtaService } from '../../providers/uta-service';
import { StorageService } from '../../providers/storage-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public user: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public _storage: StorageService,
    public _uta: UtaService,
  ) {
  }

  ionViewDidLoad() {
  }

  updateData(){
    let loader = this.loadingCtrl.create();
    loader.present();

    this._storage.getLocalId()
    .then( university_id => {
      
    let local_id = JSON.stringify(university_id).replace(/\"/g, "");
    let access = 1;

      this._uta.getUserData(local_id, access)
      .then(_ => {
        loader.dismiss();
      })
      .catch(error => {
        loader.dismiss();
        error = "Error al actualizar datos. Compruebe su conexión a internet";
        this.alertMsg("Actualizar Datos", error);
      });
    })
  }

  //MOSTRAR UN PEQUEÑO ALERT CON MENSAJE ESPECIFICO
  alertMsg(titulo: string, msg: string): Alert {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: msg,
      buttons: ['Aceptar']
    })
    alert.present();
    return alert;
  }
}