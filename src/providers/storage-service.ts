import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class StorageService {

  constructor(
    public http: Http,
    public storage: Storage
  ){}

  //DEVUELVE TODOS LOS DATOS DEL OBJETO
  getAll(): Promise<any>{
    return this.storage.ready()
    .then( _ => this.storage.get('user')
    .then(user => user ) );
  }

  //DEVUELVE DATOS PERSONALES
  getPersonalInfo(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.personal)
    .then(personal => personal))
  }

  //DEVUELVE EVALUACIONES
  getEvaluaciones(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.evaluacion)
    .then(evaluaciones => evaluaciones))
  }

  //DEVUELVE INSCRIPCIONES
   getInscripcion(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.inscripcion)
    .then(inscripcion => inscripcion))
  }

  //DEVUELVE PERIODOS
  getPeriodo(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.periodos)
    .then(periodo => periodo))
  }

  //DEVUELVE LA FOTO DEL USUARIO
  getUserPhoto()
  {
    return this.storage.ready()
      .then(_ => this.storage.get('user')
      .then(data => data = data.foto )
      .then(photo => photo ))
  }

  //DEVUELVE EL ID DE USUARIO
  getLocalId()
  {
    return this.storage.ready()
      .then(_ => this.storage.get('university_id')
      .then(university_id => university_id))
  }

  //DEVUELVE EL ID DE ONESIGNAL
  getOneSignalId()
  {
    return this.storage.ready()
      .then(_ => this.storage.get('onesignal_id')
      .then(onesignal_id => onesignal_id))
  }

  //DEVUELVE MENSAJES
  getMensajes(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.mensajes)
    .then(mensajes => mensajes))
  }

  //DEVUELVE RECURSOS
  getRecursos(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.recursos)
    .then(recursos => recursos))
  }

  //DEVUELVE LA ASISTENCIA
  getAsistencia(): Promise<any>{
    return this.storage.ready()
    .then(_ => this.storage.get('user')
    .then(data => data = data.asistencia)
    .then(asistencia => asistencia))
  }

}
