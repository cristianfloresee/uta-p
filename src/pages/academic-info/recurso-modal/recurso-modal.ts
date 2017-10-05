import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Gesture } from 'ionic-angular'
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'recurso-modal',
  templateUrl: 'recurso-modal.html',
})
export class RecursoModal {

  recurso_url = 'https://academico.uta.cl';
  parametros;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public sanitizer: DomSanitizer,
  private socialSharing: SocialSharing) {

    this.parametros = navParams.get('recurso');
    this.parametros.CAMINO = this.sanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=https://academico.uta.cl' + this.parametros.CAMINO + '&embedded=true');
    console.log(this.parametros.CAMINO);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecursoModal');
  }

  

  tap(){
    let url = 'https://docs.google.com/viewer?url=https://academico.uta.cl/cursos/2016-2/0001251/recursos/r-6.ppt&embedded=true'
    this.socialSharing.share('mensaje', 'asunto', null, url );
  }



}
