import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

//FUNCIONALIDADES NATIVAS
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'docente-modal',
  templateUrl: 'docente-modal.html',
  providers:[CallNumber, EmailComposer]
})
export class DocenteModal {

  public photoUrl;
  parametros;
  contactNo:any=7376421282;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public emailComposer:EmailComposer,
    public callNumber:CallNumber,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File
  ) {
    this.parametros = navParams.get('docente');
    this.photoUrl = "http://chitita.uta.cl/fotos/" + this.parametros.FOTO;
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
  }

  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  enviarEmail(){
    let email = {
      app: 'gmail',
      to: this.parametros.EMAIL,
      isHtml: true
    };

    
    this.emailComposer.open(email,function () {
      console.log('email view dismissed');
    });
  }

  llamadaTelefonica(){

    this.callNumber.callNumber(this.contactNo, false)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));

  }

  call(){
    window.location.href = 'tel:' + this.contactNo;
  }

  recurso(){
    let link = 'https://docs.google.com/viewerng/viewer?url=https://academico.uta.cl/cursos/2016-2/0001078/recursos/r-19.docx';
    window.open( link, '_system', 'location=yes');
  }

  recurso1(){
    let link = 'https://docs.google.com/viewerng/viewer?url=https://academico.uta.cl/cursos/2016-2/0001078/recursos/r-19.docx';
    window.open( link, '_self', 'location=yes');
  }

  recurso2(){
    let link = 'https://docs.google.com/viewerng/viewer?url=https://academico.uta.cl/cursos/2016-2/0001078/recursos/r-19.docx';
    window.open(link, '_blank', 'location=yes');
  }

  recurso3(){
    let link = 'https://academico.uta.cl/cursos/2016-2/0001048/recursos/r-2.pdf';
    window.open(link, '_blank', 'location=yes');
  }

  abrirPPT(){
    /*
    this.fileOpener.open('https://academico.uta.cl/cursos/2016-2/0001048/recursos/r-2.pdf', 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error openening file', e)); */
    
  }

  download(){
    let targetPath = this.file.externalRootDirectory + 'Download/'+'UTA.pdf';
    const FileTransfer: FileTransferObject = this.transfer.create();
    const url = "data:application/pdf;base64,"+"https://academico.uta.cl/cursos/2016-2/0001078/recursos/r-19.docx";
    FileTransfer.download(url, targetPath).then((entry)=>{
      
    })
    /*const url = 'http://www.example.com/file.pdf';
    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
    console.log('download complete: ' + entry.toURL());
  }, (error) => {
  
  });*/
  }
}
