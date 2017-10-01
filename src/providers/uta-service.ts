import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';

//PARA TRABAJAR LAS PETICIONES HTTP
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Events } from 'ionic-angular';
import { StorageService } from './storage-service';

export class URLs {
  public static base = "https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/";
  //public static base = "/utaAPI/"; //PROXY PARA EVITAR ERRORES DE CORS - PARA EJECUTAR PROYECTO LOCALMENTE  
}

@Injectable()
export class UtaService {

  constructor(
    public http:    Http, 
    public events:  Events, 
    public storage: Storage,
    public _storage: StorageService
  ) { }


  /**GUARDA EL USUARIO EN LOCALSTORAGE Y LEVANTA EL EVENTO LOGIN**/
  login(rut: string, clave: string) {
    
    let params = new URLSearchParams(); //CREO VARIABLE TIPO PARAMETRO PARA LA PETICION
    params.set('rut', rut);
    params.set('clave', clave);

    return this.http.get(URLs.base + "iniciar-sesion", { search: params })
    .map( res => res.json()) //MAPEAR RESPUESTA PARA QUE SEA UN OBJETO CON SOLO LA DATA
    .toPromise() //CONVIERTE OBSERVABLE EN PROMESA, NO ES NECESARIO PERO FACILITA ALGUNAS COSAS
    .then( data => {

      data = data.sesion[0]; //GUARDO EL SESION[0](RESPUESTA SERVIDOR) EN DATA
     
      //SI EL SERVIDOR NO RETORNA ERROR AL OBTENER DATOS DE USUARIO, PUBLICAR EVENTO Y GUARDAR EN STORAGE
      if (data.estado == '1' && data.error == ""){
        this.sendUserId(data.idUsuario); //ENVIO EL USER_ID DE ESTUDIANTE AL SERVIDOR
        this.getUserData(data.idUsuario, 1) //OBTENGO DATOS DEL ESTUDIANTE DESDE EL SERVIDOR
        .then( u => {
          let user = u.sesion[0].datos;
          
          this.storage.ready()
          .then( _ => {
            this.storage.set('user', user);
            this.storage.set('university_id', data.idUsuario)
            .then( _ => {
              this.events.publish("login:success", user);
              return user;
            }) 
          });
        })
      } else
        throw data;   
    })

  }

  /**RETORNA LOS DATOS DE USUARIO SEGUN SU ID - AVIZAR FECHA DE ACTUALIZACION (E.G. 02/08/17 12:00PM)**/
  getUserData(idUsuario, access = null): Promise<any>{
    let lastUpdate:any = new Date();
    let params = new URLSearchParams();  
    params.set('idUsuario', idUsuario);
    params.set('acceso', access);
    console.log('obteniendo datos......');
    this.storage.set('last_update', lastUpdate);
    return this.http.get(URLs.base + "actualizar-datos", { search: params })
    .map( res => res.json())
    .toPromise()
    /*
    .catch(error => {
      console.log("Error obtener datos de usuario...", error);
    })*/
  }


  /**RETORNA OBJETO USUARIO(ARRAY) DEL LOCALSTORAGE**/
  getAuth(): Promise<any> {
    return this.storage.ready()
    .then( _ => this.storage.get('user')
    .then(user => user ) );
  }


  /**BORRA EL STORAGE, ENVIA EL USER_ID Y LEVANTA EL LOGOUT - NO PERMITE EL LOGOUT SI NO HAY INTERNET**/
  logout(local_id:string, player_id: string): Promise<any> { 
    
    let params = new URLSearchParams();
    params.set('idUsuario', local_id);
    params.set('player_id', player_id);

    return this.http.get(URLs.base + "cerrar-sesion", { search: params }) //SI RESPONDE CORRECTAMENTE BORRO EL STORAGE
      .map( res => res.json()) //MAPEAR RESPUESTA PARA QUE SEA UN OBJETO CON SOLO LA DATA
      .toPromise() //CONVIERTE OBSERVABLE EN PROMESA
      .then( data => {
        data = data.sesion[0]; //GUARDO EL SESION[0](RESPUESTA SERVIDOR) EN DATA

        //SI EL SERVIDOR NO RETORNA ERROR AL OBTENER DATA, PUBLICAR EVENTO Y BORRAR STORAGE
        if (data.estado == '1' && data.error == "" ){
          console.log("logout arroja estado 1");
          this.storage.ready()
          .then( _ => this.storage.remove('user')
            .then( _ => this.events.publish("logout:success"))
          );
        } 
        else{
          throw data;
        }
         
      })
  }

  /**ENVIA EL ID DEL ESTUDIANTE (UNIVERSITY_ID) Y EL USER_ID DE ONESIGNAL AL SERVIDOR**/
  sendUserId(university_id: string)
  {
    return this._storage.getOneSignalId()
    .then( onesignal_id => {
      let player_id = JSON.stringify(onesignal_id).replace(/\"/g, "");
      
      let params = new URLSearchParams();
      params.set('idUsuario', university_id);
      params.set('player_id', player_id);
      this.http.get(URLs.base + "grabar-playerid", { search: params })
      .map( res => res.json()) //MAPEAR RESPUESTA PARA QUE SEA UN OBJETO CON SOLO LA DATA
      .toPromise() //CONVIERTE OBSERVABLE EN PROMESA
      .then( data => {
        let result = data;
        console.log("El sendUserId devuelve: ", result);
      })
      
    });
  }

}
