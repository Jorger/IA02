# Leds Node.js/Johnny5/Socket.io/Arduino

Encendido y apagado de leds con Arduino.

![alt tag](https://dl.dropboxusercontent.com/u/181689/clientLed.png)

### Plano
![alt tag](https://dl.dropboxusercontent.com/u/181689/planoleds.png)

### Cliente

El proyecto cuenta con cliente, el cual deberá ser puesto en un servidor web (Apaceh, IIS), ya que no se hac euso de Node para servir archivos estáticos.

### Server

Server que envía y recibe las peticiones del cliente para el encendido de los leds, dependiendo de la instrucción enviada desde el cliente.

### Installation

Para instalar las dependiencias necesarias como son Socket.io y Johnny-Five

```sh
$ npm iinstall
```
Ejecutando el archivo package.json

### Versión
1.0.0

### Tecnología

* [Socket.io]
* [Johnny-five]

### Autor

Jorge Rubaino

License
----

MIT

[Socket.io]:http://socket.io/
[Johnny-five]:https://github.com/rwaldron/johnny-five