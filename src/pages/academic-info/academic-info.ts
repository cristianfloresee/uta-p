import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';

//SERVICIOS
import { StorageService } from './../../providers/storage-service';

@IonicPage()
@Component({
  selector: 'page-academic-info',
  templateUrl: 'academic-info.html',
})
export class AcademicInfoPage {
  
  tipos_clases = { "C": "CÁTEDRA", "L": "LABORATORIO", "T": "TALLER" };

  periodos;
  inscripciones;
  evaluaciones;
  asistencia;
  recursos;

  recurso_url = 'https://academico.uta.cl/';

  //ULTIMO RAMO ABIERTO (VALOR 100 PARA INDICAR QUE NO HAY NINGUN RAMO ABIERTO)
  last_isubject_open=100; 
  last_jsubject_open=100;
  evaluaciones_abiertas = [];
  asistencias_abiertas = [];
  recursos_abiertos = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _storage: StorageService,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log('Página de Información Académica Cargada...');
    
    this._storage.getPeriodo().then( data => {
      this.periodos = data;   
      console.log("periodos desde db: ", this.periodos);
    });

    this._storage.getInscripcion().then( data => {
      this.inscripciones = data;
      console.log("inscripciones desde db: ", this.inscripciones);
    });

    this._storage.getEvaluaciones().then( data => {
      this.evaluaciones = data;
      console.log("evaluaciones desde db: ", this.evaluaciones);
    });

    this._storage.getAsistencia().then( data => {
      this.asistencia = data;
      console.log("asistencia desde db: ", this.asistencia);
    });
     
    this._storage.getRecursos().then( data => {
      this.recursos = data;
      console.log("recursos desde db: ", this.recursos);
    });
    
  }

  abrirAsignatura(i,j){

    this.inscripciones[i][j].open = !this.inscripciones[i][j].open;
     
    if(this.last_isubject_open == 100 && this.last_jsubject_open == 100){
      console.log("antes no habia ningun ramo abierto")
      this.last_isubject_open = i;
      this.last_jsubject_open = j;
    }
    else{

      //SI ESTOY ABRIENDO UN SEGUNDO RAMO
      if(j!=this.last_jsubject_open){
        console.log("abriendo segundo ramo. cierro el primero");
        
        //CIERRO EL OTRO RAMO ABIERTO
        this.inscripciones[this.last_isubject_open][this.last_jsubject_open].open = false;
        this.last_isubject_open=i;
        this.last_jsubject_open=j;

        //CIERRO LAS EVALUACIONES ABIERTAS
        this.evaluaciones_abiertas.map((data)=>{
          this.evaluaciones[data].open = false;
        });
        this.evaluaciones_abiertas = [];
        console.log("evaluaciones abiertas:", this.evaluaciones_abiertas);

        //CIERRO LAS ASISTENCIAS ABIERTAS
        this.asistencias_abiertas.map((data)=>{
          this.asistencia[data].open = false;
        });
        this.asistencias_abiertas = [];
        console.log("asistencias abiertas:", this.asistencias_abiertas);

        //CIERRO LOS RECURSOS ABIERTOS
        this.recursos_abiertos.map((data)=>{
          this.recursos[data].open = false;
        });
        this.recursos_abiertos = [];
        console.log("recursos abiertos:", this.recursos_abiertos);

      }else{

        //SI ESTOY CERRANDO EL MISMO RAMO
        if(this.inscripciones[i][j].open == false){
          console.log("cerrando mismo ramo: borro el ultimo ramo abierto porque cerre este");
          this.last_isubject_open = 100;
          this.last_jsubject_open = 100;

          //CIERRO LAS EVALUACIONES ABIERTAS
          this.evaluaciones_abiertas.map((data)=>{
            this.evaluaciones[data].open = false;
          });
          this.evaluaciones_abiertas = [];
          console.log("evaluaciones abiertas:", this.evaluaciones_abiertas);

          //CIERRO LAS ASISTENCIAS ABIERTAS
          this.asistencias_abiertas.map((data)=>{
            this.asistencia[data].open = false;
          });
          this.asistencias_abiertas = [];
          console.log("asistencias abiertas:", this.asistencias_abiertas);

          //CIERRO LOS RECURSOS ABIERTOS
          this.recursos_abiertos.map((data)=>{
            this.recursos[data].open = false;
          });
          this.recursos_abiertos = [];
          console.log("recursos abiertos:", this.recursos_abiertos);
        }
      }
    }
        
    console.log("inscripciones[",i,"]: ", this.inscripciones[i][j].open);
    
  }

  abrirEvaluaciones(cod_curso){

    console.log("Abrir Evaluaciones");
    console.log("CUR-CODIGO: ", cod_curso);
    this.evaluaciones[cod_curso].open = !this.evaluaciones[cod_curso].open;
    
    console.log("evaluaciones[",cod_curso,"]: ", this.evaluaciones[cod_curso].open);
    if(this.evaluaciones[cod_curso].open == false){
      
      console.log("cerrando evaluacion");
      this.evaluaciones_abiertas = this.evaluaciones_abiertas.filter((evaluacion) => evaluacion != cod_curso );
      console.log("evaluaciones abiertas:", this.evaluaciones_abiertas);
    
    }else{
      console.log("abriendo evaluaciones");
      this.evaluaciones_abiertas.push(cod_curso);
      console.log("evaluaciones abiertas:", this.evaluaciones_abiertas);
    }
  }

  abrirAsistencia(cod_curso){
    console.log("Abrir Asistencia");
    console.log("CUR-CODIGO: ", cod_curso);
    this.asistencia[cod_curso].open = !this.asistencia[cod_curso].open;

    console.log("asistencia[",cod_curso,"]: ", this.asistencia[cod_curso].open);
    if(this.asistencia[cod_curso].open == false){
      
      console.log("cerrando evaluacion");
      this.asistencias_abiertas = this.asistencias_abiertas.filter((asistencia) => asistencia != cod_curso );
      console.log("asistencias abiertas:", this.asistencias_abiertas);
    
    }else{
      console.log("abriendo asistencias");
      this.asistencias_abiertas.push(cod_curso);
      console.log("asistencias abiertas:", this.asistencias_abiertas);
    }
  }
  
  abrirRecursos(cod_curso){
    console.log("Abrir Recursos");
    console.log("CUR-CODIGO: ", cod_curso);
    this.recursos[cod_curso].open = !this.recursos[cod_curso].open;

    console.log("recursos[",cod_curso,"]: ", this.recursos[cod_curso].open);
    if(this.recursos[cod_curso].open == false){
      
      console.log("cerrando recurso");
      this.recursos_abiertos = this.recursos_abiertos.filter((recurso) => recurso != cod_curso );
      console.log("recursos abiertos:", this.recursos_abiertos);
    
    }else{
      console.log("abriendo recursos");
      this.recursos_abiertos.push(cod_curso);
      console.log("recursos abiertos:", this.recursos_abiertos);
    }
  }

  abrirModalDocente(docente){

    console.log(docente);
    this.modalCtrl.create('DocenteModal', {docente}, { cssClass: 'inset-modal' })
                  .present();
  }

  abrirModalRecurso(recurso){

    console.log(recurso);
    this.modalCtrl.create('RecursoModal', {recurso})
                  .present();
  }
}
