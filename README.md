<h1 align="center">
    UTA-M Aplicación Móvil basada en Ionic
</h1>

<h2 align="center">
	Aplicación para la Universidad de Tarapacá
</h2>

<p align="center">
    <a href="https://ionicframework.com/">
        <img src="https://img.shields.io/badge/ionic-v3.8-brightgreen.svg"
             alt="ionic version">
    </a>
    <a href="https://ionicframework.com/">
        <img src="https://img.shields.io/badge/angular-v4.0-brightgreen.svg"
             alt="angular version">
    </a>
     <a href="https://travis-ci.org/badges/shields">
        <img src="https://img.shields.io/badge/nodejs-v6.11-blue.svg"
             alt="nodejs version">
    </a>
    <a href="https://npmjs.org/package/gh-badges">
        <img src="https://img.shields.io/badge/npm-v3.10-blue.svg"
             alt="npm version">
    </a>
</p>


## Tabla de Contenidos
 - [1. Empezando](#1-empezando)
 - [2. Características](#2-características)
 - [3. Use Cases](#use-cases)
 - [4. App Preview](#app-preview)
 - [5. Deploying](#5-deploying)

## 1. Empezando
* Clone este repositorio: <b>`https://github.com/cristianfloresee/uta-m.git`</b>

* Ejecute <b>`npm install`</b> en el terminal dentro de la raíz del proyecto para instalar las dependencias.
* Ejecute <b>`ionic serve`</b> en el terminal dentro de la raíz del proyecto.

## 2. Características
<h3>2.1. Inicio de Sesión</h3>

Para iniciar sesión el usuario debe ingresar su *rut* y *contraseña*.

<p>Petición al iniciar sesión:</p>

https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/iniciar-sesion?rut=18313961&clave=MDgvMTIvMTk5Mg==
<p>
En esta situación tenemos los parámatros <b>rut</b> que corresponde al rut del usuario y la <b>clave</b> que corresponde a la contraseña del usuario.
</p>

```
rut: 18313961
clave: MDgvMTIvMTk5Mg==
```
<p>Una vez que se manda la petición y el servidor responde correctamente se realizan otras dos peticiones.</p>

* Se envía una petición para obtener todos los datos del estudiante. [Ver -Obtener datos del estudiante-](#obtener-datos-del-estudiante)
* Se envía el *onesignal_id* que es un identificador único por dispositivo que servirá para posteriormente enviar notificaciones push de forma segmentada. [Ver -Envío del id de OneSignal para las notificaciones push-](#obtener-datos-del-estudiante)


<h3>2.2. Obtener datos del estudiante</h3>

En esta petición se envían los parámetros de *id del estudiante* y un parámetro llamado *acceso*.

<p>Este parámetro de acceso servirá para tener datos estadísticos y diferenciar cuantas veces el usuario se logea y cuantas veces actualiza la información de la aplicación. 
</p>

* Para el caso de pasar el logueo correctamente y querer obtener los datos para la aplicación se enviaran los parámetro de <b>idUsuario</b> y <b>acceso</b>. Este último con el valor 1, como se muestra a continuación.

    https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/actualizar-datos?idUsuario=62178&acceso=1

* Por otro lado, en caso de posteriormente querer actualizar los datos de la aplicación (ya estando logueado) el parámetro de <b>acceso</b> no será necesario. A continuación, se muestra el ejemplo.

    https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/actualizar-datos?idUsuario=62178



<b>Notas:</b>
* *En caso de no haber logrado obtener datos (por ejemplo, si no hay conexión a internet), mostrar una alerta indicando de que no hay conexión.*



<h3>2.3. Envío del id de OneSignal para las notificaciones push</h3>

En esta petición se envían los parámetros de *id del estudiante*, que corresponde a un identificador que maneja el servidor de la universidad para identificar a cada estudiante, y también se envía el id de OneSignal para las notificaciones push.

<p>Petición del envío del id para las notificaciones:</p>

https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/grabar-playerid?idUsuario=62178&player_id=1976bf74-f050-4960-a6af-6951d8af3013

<p>
En esta situación tenemos los parámatros <b>idUsuario</b> que corresponde al id del usuario y el <b>player_id</b> que corresponde al id de OneSignal.
</p>

```
idUsuario: 62178
player_id: 1976bf74-f050-4960-a6af-6951d8af3013
```

<b>Notas:</b>
* *El id que entrega OneSignal demorá en obtenerse cuando es la primera vez que se está ejecutando la aplicación*
-Al refrescar la página no envió el parámetro de acceso.


<h3>2.4. Cierre de Sesión</h3>
<p>Al cerrar sesión se debe enviar el id de onesignal (id del dispositivo que genera OneSignal) al servidor, esto para indicar que el estudiante cerro sesión y el servidor no debe enviar notificaciones push a este dispositivo a menos que algún usuario halla vuelto a iniciar sesión. 
</p>
<p>La idea es que solo envíen notificaciones push si es que alguien tiene la sesión abierta. Por lo antes mencionado, no se debe permitir que los estudiantes puedan cerrar sesión si estos no tienen conexión a internet.
</p>
<p>En caso de que intenten cerrar sesión sin tener conexión a internet se debe abrir una alerta indicando que no tiene conexión.
</p>
<p>
La petición de cierre de sesión debe tener como parámetros el id del usuario y el id de OneSignal.
</p>

https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/cerrar-sesion?idUsuario=62178&player_id=1976bf74-f050-4960-a6af-6951d8af3013


<p>
En esta situación tenemos los parámatros <b>idUsuario</b> que corresponde al id del usuario y el <b>player_id</b> que corresponde al id de OneSignal.
</p>

```
idUsuario: 62178
player_id: 1976bf74-f050-4960-a6af-6951d8af3013
```



## 5. Deploying
```
ionic cordova platform add android
```

```
ionic cordova platform add ios
```

```
ionic cordova build android --prod
```
```
ionic cordova build ios --prod
```

## 6. Status Bar Transparente en Android
<p>
Para obtener el status bar transparente en android se debe modificar un archivo de la carpeta android antes de generar el apk.
</p>
<br>
<p align="center">
  <img src="https://raw.githubusercontent.com/jeneser/ionic-super-bar/master/screenshot.gif" />
</p>

https://github.com/jeneser/ionic-super-bar

## 7. Fuente de Iconos utilizados

https://icomoon.io/

## 7. Keyboard

<h3>7.1. RUT - Login</h3>

Forzar al keyboard a mostrar solo carácteres permitidos en el input <b>RUT</b> de la página <b>Login</b>.
Carácteres Permitidos: 0123456789Kk

<p align="center">
  <img src="https://www.axure.com/c/attachments/forum/mobile-prototyping/2917d1387188343-how-show-numeric-keyboard-iphone-2013-12-16-14-02-37.png" />
</p>

<p align="center">
  <img src="http://res.cloudinary.com/dwj4kbnam/image/upload/v1506223260/login1_b9nbgv.png" />
</p>

<p align="center">
  <img src="http://res.cloudinary.com/dwj4kbnam/image/upload/v1506223271/login2_i1qhg7.png" />
</p>

<p align="center">
  <img src="http://res.cloudinary.com/dwj4kbnam/image/upload/v1506223272/login3_k8ufuu.png" />
</p>

<p align="center">
  <img src="http://res.cloudinary.com/dwj4kbnam/image/upload/v1506223272/login4_idwpct.png" />
</p>

<p align="center">
  <img src="http://res.cloudinary.com/dwj4kbnam/image/upload/v1506223272/login5_ksra8j.png" />
</p>