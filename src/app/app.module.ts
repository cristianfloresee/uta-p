import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

//MODULOS ANGULAR
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'; //MODULO PARA PODER HACER PETICIONES HTTP
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //MODULOS PARA HACER LOS FORMULARIOS REACTIVOS

//MODULOS IONIC
import { IonicStorageModule } from '@ionic/storage'; 

//FUNCIONALIDADES NATIVAS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

//SERVICIOS 
import { UtaService } from './../providers/uta-service';
import { StorageService } from './../providers/storage-service';
import { Base64Service } from '../providers/base64-service';

//ANIMACION ¿CUAL DEJAR?
import { AnimatorModule } from 'css-animator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PipesModule } from './pipes.module';
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AnimatorModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    //SERVICIOS************************
    Base64Service,
    StorageService,
    UtaService,
    //FUNCIONALIDADES NATIVAS**********
    StatusBar,
    SplashScreen,
    OneSignal,
    FileOpener,
    File,
    FileTransfer,
    FileTransferObject,
    BrowserTab,
    InAppBrowser,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
