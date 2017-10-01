import { Storage } from '@ionic/storage';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController, Events, AlertController, Alert } from 'ionic-angular';

//FUNCIONALIDADES NATIVAS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

//SERVICIOS
import { UtaService } from '../providers/uta-service';
import { StorageService } from './../providers/storage-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  activePage: any;
  pages: Array<{title: string, component: any, icon: string}>;
  user: any;


  constructor(
    public platform:     Platform, 
    public statusBar:    StatusBar,
    public splashScreen: SplashScreen,
    private oneSignal:   OneSignal,
    public _uta:         UtaService,
    public _storage:     StorageService,
    public loadingCtrl:  LoadingController,
    public alertCtrl:   AlertController,
    public menuCtrl:     MenuController,
    public events:       Events,
    public storage:      Storage
  ) {

    this.user = null;

    //PAGINAS DEL MENU
    this.pages = [
      { title: 'Inicio', component: 'HomePage', icon: 'fa fa-home' },
      { title: 'Perfil', component: 'PersonalInfoPage', icon: 'fa fa-user' },
      { title: 'Mensajes', component: 'MessagesPage', icon: 'fa fa-envelope' },
      { title: 'Asignaturas', component: 'AcademicInfoPage', icon: 'fa fa-book' },
      //{ title: 'Progreso', component: 'HomePage', icon: 'ai-area-graph' },
      { title: 'Configuración', component: 'HomePage', icon: 'fa fa-cog' },
    ];

    this.activePage = this.pages[0]; //PRIMERA PÁGINA ACTIVA POR DEFECTO

  }

  ngOnInit() {
    this.initializeApp();  //INICIALIZA PLUGINS Y LLAMADAS NATIVAS

    let loader = this.loadingCtrl.create();
    loader.present();

    //PREGUNTAR SI ESTA LOGEADO
    this._uta.getAuth().then( auth => {
      loader.dismiss();
      this.user = auth;
      console.log(auth);
      
     
      if ( auth ){  //SI ESTA LOGEADO
        this.menuCtrl.enable(true);
        this._uta.getUserData(this.user.personal.PER_ID);
        this.nav.setRoot('HomePage', {}, { animate: true, direction: 'forward' });

      } else {
        this.menuCtrl.enable(false);
        this.nav.setRoot('LoginPage', {}, { animate: true, direction: 'forward' });

      }
    })

    //MANEJADORES DE EVENTOS LOGIN & LOGOUT
    this.events.subscribe("login:success",  user => this.onLogin(user));
    this.events.subscribe("logout:success",  _ => this.onLogout());
  }



  //INICIALIZACION DE PLUGINS NATIVOS
  initializeApp() {
    this.platform.ready().then((res) => {

      if (res == 'cordova') {
        
        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString("#33000000");
        }
        
        //CONFIGURACION STATUSBAR
        //this.statusBar.overlaysWebView(true);
        //this.statusBar.styleBlackTranslucent()
        //this.statusBar.backgroundColorByHexString('#BE8909');
        //this.statusBar.backgroundColorByHexString("#33000000");
		    //FIN STATUS BAR

        //CONFIGURACION SPLASHSCREEEN
        this.splashScreen.hide();
        //FIN SPLASHSCREEN

        //CONFIGURACION ONESIGNAL
        this.oneSignal.startInit("237040ab-54a9-4cd4-b6b6-1a48d3c31327", "293024235261")
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
            //hace algo cuando la notificacion es recibida
        });

        this.oneSignal.handleNotificationOpened().subscribe(() => {
            //hace algo cuando la notificacion es abierta
        });
        this.oneSignal.endInit();

        this.oneSignal.getIds()
        .then((ids)=> {
          this.storage.ready()
          .then( _ => {
            this.storage.set('onesignal_id', ids.userId);
            alert("PLAYER_ID DEL INIT: "+ ids.userId);
          });
        })
        //FIN ONESIGNAL
      }

    });
  }


  //IR A PAGINA ESPECIFICA
  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  //CERRAR SESION
  logout() {
    let loader = this.loadingCtrl.create();
    loader.present();

    this._storage.getOneSignalId()
    .then( onesignal_id => {

      //if(onesignal_id != null){

        this._storage.getLocalId()
        .then( university_id => {
          
          let player_id = JSON.stringify(onesignal_id).replace(/\"/g, "");;
          let local_id = JSON.stringify(university_id).replace(/\"/g, "");;

          this._uta.logout(local_id, player_id)
          .then(_ => {
            loader.dismiss();
          })
          .catch(error => {
            loader.dismiss();
            error.error = "Error al cerrar sesión. Compruebe su conexión a internet";
            this.alertMsg("Cierre Sesión", error.error);
          });
        })

      /*}
      else{
        loader.dismiss();
        let error = "Error al cerrar sesión. No existe el OneSignal ID";
        this.alertMsg("Cierre Sesión", error);
      }*/
    })
    
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
        error.error = "Error al actualizar datos. Compruebe su conexión a internet";
        this.alertMsg("Actualizar Datos", error.error);
      });
    })
  }

 
  //CUANDO SE EMITE EL EVENTO LOGIN*****************************************************
  onLogin(user){
    console.log("onLogin:", user);
    this.user = user;
    this.menuCtrl.enable(true);
  }

  //CUANDO SE EMITE EL EVENTO LOGOUT****************************************************
  onLogout(){
    console.log("onLogout");
    this.user = null;
    this.menuCtrl.enable(false);
    this.nav.setRoot('LoginPage', {}, { animate: true, direction: 'forward' });
  }

  //ESTABLECE LA PAGINA ACTIVA**********************************************************
  checkActive(page){
    return page == this.activePage;
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
