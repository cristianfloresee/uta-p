
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from './../../providers/storage-service';

@IonicPage()
@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {

  public photoUrl;

   //*********** VARIABLES PARA EL DESVANECIMIENTO DEL HEADER **************//
  showToolbar:boolean = false;
  transition:boolean = false;
  headerImgSize:string = '100%';
  headerImgUrl:string = '';
  //****************************//

  public user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _storage: StorageService,
    public ref: ChangeDetectorRef) {

      this._storage.getUserPhoto().then( photo => {
          let user_photo = photo;
          this.photoUrl = "http://chitita.uta.cl/fotos/" + user_photo;
      });
      
  }

  ionViewDidLoad() {
    console.log('Página de Información Personal Cargada...');
    this._storage.getPersonalInfo().then( auth => {
      this.user = auth;
      console.log("objetoPersonal", this.user);
    });
    this._storage.getUserPhoto().then( photo => {
        console.log("foto:" + photo);
    });

  }

  //DESVANECIENDO EL HEADER
  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    if(scrollTop < 0){
        this.transition = false;
    }else{
        this.transition = true;
    }
    this.ref.detectChanges();
  }

}
