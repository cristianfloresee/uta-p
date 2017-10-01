import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  //ULTIMO RAMO ABIERTO (VALOR 100 PARA INDICAR QUE NO HAY NINGUN RAMO ABIERTO)
  last_isubject_open=100; 
  last_jsubject_open=100;
  ultima_evaluacion_abierta=100;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _storage: StorageService,
  ) {}

  ionViewDidLoad() {
    console.log('Página de Información Académica Cargada...');
    
    //CARGA DATOS PERIODO DEL STORAGE
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
        //CIERRO EL OTRO ABIERTO
        this.inscripciones[this.last_isubject_open][this.last_jsubject_open].open = false;
        this.last_isubject_open=i;
        this.last_jsubject_open=j;
        if(this.ultima_evaluacion_abierta!=100){
          this.evaluaciones[this.ultima_evaluacion_abierta].open=false;
        this.ultima_evaluacion_abierta=100;
        }

      }else{
        //SI ESTOY CERRANDO EL MISMO RAMO
        if(this.inscripciones[i][j].open == false){
          console.log("cerrando mismo ramo: borro el ultimo ramo abierto porque cerre este");
          this.last_isubject_open = 100;
          this.last_jsubject_open = 100;
          if(this.ultima_evaluacion_abierta!=100){
            this.evaluaciones[this.ultima_evaluacion_abierta].open=false;
            this.ultima_evaluacion_abierta=100;
          }
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
      console.log("cerrando evaluaciones");
      this.ultima_evaluacion_abierta=100;
    }else{
      console.log("abriendo evaluaciones");
      this.ultima_evaluacion_abierta=cod_curso;
    }
  }

  abrirAsistencia(cod_curso){
    console.log("Abrir Asistencia");
    console.log("CUR-CODIGO: ", cod_curso);
    this.asistencia[cod_curso].open = !this.asistencia[cod_curso].open;
    console.log("asistencia[",cod_curso,"]: ", this.asistencia[cod_curso].open);
  }
  
  abrirRecursos(cod_curso){
    console.log("Abrir Recursos");
    console.log("CUR-CODIGO: ", cod_curso);
    this.recursos[cod_curso].open = !this.recursos[cod_curso].open;
    console.log("recursos[",cod_curso,"]: ", this.recursos[cod_curso].open);
  }
}
