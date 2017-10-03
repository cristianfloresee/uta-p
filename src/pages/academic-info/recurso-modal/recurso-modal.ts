import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'recurso-modal',
  templateUrl: 'recurso-modal.html',
})
export class RecursoModal {

  parametros;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,) {

    this.parametros = navParams.get('docente');
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecursoModal');
  }

}
