import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, Alert } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // VALIDACIONES DE FORMULARIO
// import { CustomValidators } from 'ng2-validation'; // VALIDACIONES PERSONALIZADAS DE FORMULARIO

//SERVICIOS
import { UtaService } from '../../providers/uta-service';
import { Base64Service } from '../../providers/base64-service';

//ANIMACION
//import { trigger, style, transition, animate } from '@angular/animations';
import { AnimationService, AnimationBuilder } from 'css-animator';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit{
  
  public loginForm: FormGroup;

  @ViewChild('myElement') myElem;
  private animator: AnimationBuilder;

  constructor(
    public navCtrl:           NavController,
    public fb:                FormBuilder,
    public loadingCtrl:       LoadingController,
    public alertCtrl:         AlertController,
    public _uta:              UtaService,
    public _base64:           Base64Service,
    public animationService:  AnimationService
  ) {
    
    this.animator = animationService.builder();
    
    //GRUPO DE VALIDACIONES PARA EL FORMULARIO
    this.loginForm = this.fb.group({
      rut: ["183139614",   Validators.compose([ Validators.required, Validators.minLength(12), Validators.maxLength(12) ])],
      clave: ["08/12/1992", Validators.compose([ Validators.required, Validators.minLength(8) ])],
    });
  }

  ionViewDidLoad() {
    
  }

  ngOnInit() {
    
    //this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }

  //LLAMADA A SERVICIO DE LOGIN****************************************************
  login(){

    let loader = this.loadingCtrl.create();
    loader.present();

    //LIMPIO EL RUT Y SACO DIGITO VERIFICADOR PARA ENVIAR LA PETICIÓN
    let clean_rut = this.loginForm.value.rut;
    clean_rut = clean_rut.replace(".","");
    clean_rut = clean_rut.replace(".","");
    clean_rut = clean_rut.replace(/-/,"");
    let length_rut = clean_rut.length;
    clean_rut = clean_rut.substring(0, length_rut - 1);

    //ENVIO LA PETICION USANDO EL SERVICIO
    this._uta.login(clean_rut, this._base64.encode(this.loginForm.value.clave))
    .then( _ => {
      loader.dismiss();
      this.navCtrl.setRoot('HomePage', {}, { animate: true, direction: 'forward' });
    })
    .catch(error => {
      loader.dismiss();
      switch (error.error) {  //DEPENDIENDO DEL ERROR LO MUESTRA EN FORMULARIO
        case "Usuario no se encuentra registrado.":
          this.loginForm.controls.rut.setErrors({ rut_not_register: true }); 
          break;
        case "Clave no valida.":
          this.loginForm.controls.clave.setErrors({ wrong_pass: true }); 
          break;
        default:
          console.log("Error no registrado: ", error);
          console.log("detecto error de internet"); 
          error.error = "Error al conectarse con el servidor, revise su conexión a internet ó intentelo mas tarde."
          break;
      }

      this.alertMsg("Inicio sesión", error.error); // MOSTRAR MSG CON EL ERROR
      
      // RECORRE TODOS LOS CAMPOS DEL FORMULARIO Y LOS 'ENSUCIA' PARA MOSTRAR LOS ERRORES EXISTENTES
      Object.keys(this.loginForm.controls).forEach(key => { 
        this.loginForm.controls[key].markAsDirty();
        this.loginForm.controls[key].markAsTouched();
      });
    })
  }


  //MOSTRAR UN PEQUEÑO ALERT CON MENSAJE ESPECIFICO
  alertMsg(titulo: string, msg: string): Alert {
    let alert = this.alertCtrl.create({
      title:    titulo,
      subTitle: msg,
      buttons:  ['Aceptar']
    })
    alert.present();
    return alert;
  }

  cleanRUT(){
    console.log("evento focus: Al presionar input saca todos los puntos y el - del formato RUT");
    let obj = this.loginForm.value.rut;
    obj = obj.replace(".","");
    obj = obj.replace(".","");
    obj = obj.replace(/-/,"");
    this.loginForm.controls['rut'].setValue(obj);
  }

  validRUT(){
    console.log("evento input: no puede ingresar valores no permitidos");
    let obj = this.loginForm.value.rut;
    let longitud_rut = obj.length;
    obj = obj.replace(/[^0-9\K\k]/g,'');
    this.loginForm.controls['rut'].setValue(obj);
    console.log("borro si tiene mas de 9 valores: ", longitud_rut);
    if(longitud_rut > 9) { 
      obj = obj.substring(0, longitud_rut - 1);
      this.loginForm.controls['rut'].setValue(obj);
    }
  }

  checkRUT(){
    console.log("evento blur: Al salir comprueba RUT sea valido");
    let campo_rut = this.loginForm.value.rut;
    let tmpstr = "";
    let longitud_rut = 0;
    let rutMax = campo_rut;
    let i = 0;
    let j = 0;
    let cnt=0;

    if(campo_rut.length == 0){ 
      return false;
    }

    //LIMPIA EL RUT DE "-. "
    //charAt = devuelve caracter en indice especificado
    for ( i=0; i < campo_rut.length ; i++ ){
      if ( campo_rut.charAt(i) != ' ' && campo_rut.charAt(i) != '.' && campo_rut.charAt(i) != '-' ){
        tmpstr = tmpstr + campo_rut.charAt(i);
      }
    }
		campo_rut = tmpstr;	
    longitud_rut = campo_rut.length;
    tmpstr = "";
    console.log("longitud de rut 1: ", longitud_rut);
    console.log("rut limpio 1: ", campo_rut);

    //SI ENCUENTRA 0'S EN EL COMIENZO DEL RUT LO LIMPIA
    for ( i=0; campo_rut.charAt(i) == '0' ; i++ );
			for (;i < campo_rut.length ; i++ )
        tmpstr = tmpstr + campo_rut.charAt(i);
    campo_rut = tmpstr;
    longitud_rut = campo_rut.length; 
    tmpstr="";
    console.log("longitud de rut 2: ", longitud_rut);
    console.log("rut limpio 2: ", campo_rut);

    //SI EL RUT TIENE MENOS 7 DIGITOS
    if ( longitud_rut < 8 )
		{
      //alert("Debe ingresar el RUT completo.");
      this.loginForm.controls.rut.setErrors({ incomplete_rut: true }); 
			return false;
    }
    
    //SI SE INGRESA UN VALOR/DIGITO NO VÁLIDO PARA EL RUT COMO LETRAS DISTINTAS DE K O SIMBOLOS
    //ESTO NO DEBERIA OCURRIR DEBIDO AL EVENTO QUE IMPIDE INGRESAR ESTOS VALORES. PERO DE TODAS MANERAS SE DEJARÁ
    for (i=0; i < longitud_rut ; i++ )
		{
			if( (campo_rut.charAt(i) != '0') && (campo_rut.charAt(i) != '1') && (campo_rut.charAt(i) !='2') && (campo_rut.charAt(i) != '3') && (campo_rut.charAt(i) != '4') && (campo_rut.charAt(i) !='5') && (campo_rut.charAt(i) != '6') && (campo_rut.charAt(i) != '7') && (campo_rut.charAt(i) != '8') && (campo_rut.charAt(i) != '9') && (campo_rut.charAt(i) !='k') && (campo_rut.charAt(i) != 'K') )
			{
        //console.log("El valor ingresado no corresponde a un RUT valido.");
        this.loginForm.controls.rut.setErrors({ rut_not_valid: true });
				return false;
			}
    }

    //VE SI EL RUT CORRESPONDE AL DE UNA PERSONA
    for ( i=0; i < rutMax.length ; i++ )
			if ( rutMax.charAt(i) != ' ' && rutMax.charAt(i) != '.' && rutMax.charAt(i) != '-' )
			  tmpstr = tmpstr + rutMax.charAt(i);
    tmpstr = tmpstr.substring(0, tmpstr.length - 1); //SACA EL ULTIMO DIGITO
    console.log(tmpstr);
    if ( (!(+tmpstr < 50000000)) )
		{
      //console.log("El Rut ingresado no corresponde a un RUT de Persona Natural");
      this.loginForm.controls.rut.setErrors({ rut_not_valid: true });
			return false;
    }
    
    //INVIERTE EL RUT
    var invertido = "";
    for ( i=(longitud_rut-1),j=0; i>=0; i--,j++ )
			invertido = invertido + campo_rut.charAt(i);
    console.log("invertido: ", invertido);

    //DA FORMATO AL RUT*****
    //GENERA EL DIGITO VERIFICADOR 4-
    var drut = "";
		drut = drut + invertido.charAt(0);
    drut = drut + '-';
    console.log(drut);

    //PONE LOS PUNTO DEL RUT 169.313.81
    cnt = 0;
		for ( i=1,j=2; i<longitud_rut; i++,j++ )
		{
			if ( cnt == 3 )
			{
				drut = drut + '.';
				j++;
				drut = drut + invertido.charAt(i);
				cnt = 1;
			}
			else
			{
				drut = drut + invertido.charAt(i);
				cnt++;
			}
    }
    invertido = "";
    console.log(drut); //RESULTADO RUT INVERSO 4-169.313.81

    //INVIERTE EL RUT PARA DEJARLO EN EL FORMATO CORRECTO 18.313.961-4 Y DEJA K EN MAYUSCULA
    for ( i=(drut.length-1),j=0; i>=0; i--,j++ )
		{
			if (drut.charAt(i)=='k')
				invertido = invertido + 'K';
			else
				invertido = invertido + drut.charAt(i);
    }
    console.log(invertido);

    //ASIGNA EL FORMATO AL INPUT DEL HTML
    this.loginForm.controls['rut'].setValue(invertido);
    
    if (!this.checkDV(campo_rut))
		{
      //console.log("El RUT ingresado es incorrecto");
      this.loginForm.controls.rut.setErrors({ rut_not_valid: true });
			return false;
    }
    
    return true;
  }

  /*******CALCULA EL DIGITO VERIFICADOR Y VE SI COINCIDE CON EL INGRESADO*******/
  checkDV(_rut)
	{
    let largo = _rut.length;
    let rut = "";
    let suma = 0;
    let mul = 0;
    let res = 0;
    let i = 0;
    let dvr = '0';
    let dvi = 0;
    
    //QUITA EL DIGITO VERIFICADOR
    rut = _rut.substring(0, largo - 1);
    console.log("QUITA EL DV rut: ", rut);
    
    //OBTIENE SOLO DIGITO VERIFICADOR
    let digito_verificador = _rut.charAt(largo-1);
    console.log("digito verificador: ", digito_verificador);

    //VE SI EL RUT O EL DV ES NULO *NUNCA ENTRA*
    if(rut == null || digito_verificador == null){
      console.log("rut o dv nulo");
			return false;
    }

    suma = 0;
		mul  = 2;
		for (i= rut.length -1 ; i >= 0; i--)
		{
			suma = suma + +rut.charAt(i) * mul;
			if(mul == 7){
				mul = 2;
			}
			else{
				mul++;
			}
    }
    res = suma % 11;
   
    if (res==1)
		{
			dvr = 'k';
		}
		else
		{
			if(res==0){
			  dvr = '0';
			}
			else
			{
			  dvi = 11-res;
			  dvr = dvi + "";
			}
    }
   
    if(dvr != digito_verificador.toLowerCase())
		{
			return false;
		}
		return true;
  }

}

//RUT INGRESADO NO CORRESPONDA A RUT DE PERSONA NATURAL O SI EL DV NO ES VALIDO = RUT NO VÁLIDO

