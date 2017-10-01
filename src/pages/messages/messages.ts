import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from './../../providers/storage-service';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  messages: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _storage: StorageService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
    this._storage.getMensajes().then( msgs => {
      this.messages = msgs;
      console.log("Mensajes: ", this.messages);
    });
  }

}
