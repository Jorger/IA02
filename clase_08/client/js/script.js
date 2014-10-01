window.onload = function()
{
	inicio();
}
var debug = "";
//Inicio de la aplición...


function inicio()
{
	//Capturar variables de la URL (GET)...
	//$_GET[""];
	function getUrlVars() 
	{
    	var vars = {};
    	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
    	{
        	vars[key] = value;
    	});
    	return vars;
	}
	var nomJugador = [];
	//Incializando variables que serán cargadas por el socket...
	var sala = decodeURIComponent(getUrlVars()["sala"]);
	var nombre = decodeURIComponent(getUrlVars()["nombre"]);
	//console.log("El nombre es: " + nombre);
	var fichaJugador = 0;
	var jugadorInicia = 0;
	terminaJuego = false; //Para saber si el juego ha terminado...
	var puntuaJuego = [0, 0]; //Guarda las puntuaciones de Juego...
	var turnos = 0; //Para dar turnos por usuario...
	var txtFichas = ["X", "O"];
	//var pc = 0;
	//Fin inicializa variables...
	//Crear el Socket de conexión al server...
	//var serverBaseUrl = "http://10.157.5.112:8088";
	var serverBaseUrl = "http://localhost:8088";
	var socket = io.connect(serverBaseUrl);
	var sessionId = '';
	var idUsuario = Math.floor((Math.random() * 10000) + 1);
	//var nombre = prompt("Por favor digita tu nombre");
	socket.on('connect', function ()
	{
	    sessionId = socket.socket.sessionid;
	    socket.emit('nuevoUsuario', {id: sessionId, sala: sala, idusuario: idUsuario, nombre : nombre});
	});

	//Traer a los usuarios que están conectados...
	socket.on('nuevaConexion', function (data)
  	{
  		if(data.num > 2 && data.para == idUsuario)
  		{
  			alert("La partida ya tiene dos usuarios");
  			terminaJuego = true;
  		}
  		else
  		{
	  		var txtPuntua = "";
	  		for(var i = 0; i < data.participantes.length; i++) 
	  		{
	  			console.log("Usuario conecta: " + data.participantes[i].id);
	  			//console.log("EL NOMBRE ES: " + data.participantes[i].nombre);
	  			nomJugador[i] = data.participantes[i].nombre;
	  			if(data.participantes[i].id === idUsuario)
  				{
  					fichaJugador = data.participantes[i].ficha;
  					if(data.participantes[i].ficha == 1) //Es quien comenzará...
		  			{
		  				nom_div("inicia").innerHTML = "INICIAS TU EL JUEGO";
		  			}
		  			else
		  			{
		  				nom_div("inicia").innerHTML = "ESPERANDO LA JUGADA";
		  				terminaJuego = true;	
		  			}
  				}
  				if(txtPuntua != "")
  				{
  					txtPuntua += " - ";
  				}
  				txtPuntua += nomJugador[i] + " = 0";
	  		}
	  		nom_div("puntuacion").innerHTML = txtPuntua;
  		}
  	});

  	socket.on('haceJugada', function (data)
  	{
  		if(data.id != idUsuario)//No es el mismo usuario...
  		{
  			console.log("Fila: " + data.f + "COL: " + data.c + " jugador: " + data.ficha);
  			nom_div(data.f+"_"+data.c).innerHTML = txtFichas[data.ficha - 1];//0, 2
  			terminaJuego = false;
  			posMinMax(Number(data.f), Number(data.c), data.ficha);
  			nom_div("inicia").innerHTML = "ES TU TURNO!!";
  			procesarJugada(data.ficha);
  		}
  	});
	//Fin de la conexión al Socket...
	vectorMinMAX = [];
	function creaEscenario()
	{
		var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0'>";
		var divTabla = "";
		for(var i = 0; i < 3; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < 3; c++)
			{
				divTabla = i + "_" + c;
				txt += "<td id = '"+(divTabla)+"'></td>";
				vectorMinMAX.push(0); //Nuevo...
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}
	nom_div("escenario").innerHTML = creaEscenario();
	for(var i = 0; i < 3; i++)
	{
		for(var c = 0; c < 3; c++)
		{
			nom_div(i + "_" + c).addEventListener('click', function(event)
			{
				//debug = event;
				var pos = event.target.id.split("_");
				//alert(pos);
				//alert("Ingresa");
				if(nom_div(this.id).innerHTML == "" && !terminaJuego)
				{
					 //Pone la ficha según la selección...
					nom_div(this.id).innerHTML = txtFichas[fichaJugador - 1];
					//Bloquear la selección de Jugada...
					//nom_div("seleJugada").disabled = true;
					//Enviar la jugada del jugador...
  					socket.emit('juega', {sala: sala, id: idUsuario, fila: pos[0], columna: pos[1], ficha: fichaJugador});
  					nom_div("inicia").innerHTML = "ESPERANDO LA JUGADA";
  					//Fin de enviar la jugada...
					//Guarda la posición seleccionada...
					posMinMax(Number(pos[0]), Number(pos[1]), fichaJugador);
					procesarJugada(fichaJugador);
					terminaJuego = true; //Esperando la próxima jugada...
				}
			});
		}
	}

	function posMinMax(fila, columna, jugador)
	{
		var ind = 0;
		//console.log("Fila : " + fila + " columna : " + columna + " jugador: " + jugador);
		//ind = 2
		/*
		fila = 2
		columna = 1
		Matriz -> Vector
		Vector -> Matriz...
		*/
		if(fila == 0)
		{
			ind = columna; //2
		}
		else
		{
			if(fila == 1)
			{
				ind = columna + 3;
			}
			else
			{
				ind = columna + 6;
			}
		}
		vectorMinMAX[ind] = jugador;
	}

	function procesarJugada(ficha)
	{
		//var nomJugador = ["Jugador UNO", "Jugador DOS"];
		var hayTriqui = revisarTriqui(ficha);
		var quedaTablas = entablas();
		var txtPuntua = "";
		//No hay triqui y además hay espacio
		if(hayTriqui || quedaTablas)
		{
			if(hayTriqui)
			{
				resaltarTriqui(ficha);
				puntuaJuego[ficha - 1]++;
				txtPuntua = nomJugador [0] + " = "+(puntuaJuego[0])+" - "+(nomJugador[1])+" = " + puntuaJuego[1];
				nom_div("puntuacion").innerHTML = txtPuntua;
				alert("Ha hecho triqui " + nomJugador[ficha - 1]);
			}
			else
			{
				alert("El juego ha quedao en Tablas");
			}
			terminaJuego = true;			
		}
	}

	function entablas()
	{
		var empatados = true;
		for(var i = 0; i < vectorMinMAX.length; i++)
		{
			if(vectorMinMAX[i] == 0)
			{
				empatados = false;
				break;
			}
		}
		return empatados;
	}

	//Para revisar si hay triqui o no...
	function revisarTriqui(ficha)
	{
		//HORIZONTAL
		var estriqui = (vectorMinMAX[0] == ficha && vectorMinMAX[1] == ficha && vectorMinMAX[2]==ficha);
		estriqui = estriqui || (vectorMinMAX[3] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[5]==ficha);
		estriqui = estriqui || (vectorMinMAX[6] == ficha && vectorMinMAX[7] == ficha && vectorMinMAX[8]==ficha);
		//VERTICALES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[3] == ficha && vectorMinMAX[6]==ficha);
		estriqui = estriqui || (vectorMinMAX[1] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[7]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[5] == ficha && vectorMinMAX[8]==ficha);
		//DIAGONAlES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[8]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[6]==ficha);
		return estriqui;
	}

	function resaltarTriqui(ficha)
	{
		//console.log("LLega aca y Resalta");
		var cont = 0;
		var estriqui = false;
		var d = i = c = 0;
		var valCampo = 0;
		var celdasTriqui = []; //Guardará las celdas del triqui...
		//Horizontal y Vertical...
		for(d = 1; d <= 2; d++)
		{
			for(i = 0; i < 3; i++)
			{
				cont = 0;
				for(c = 0; c < 3; c++)
				{
					if(d == 1)//Horizontales...
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					else
					{
						valCampo = nom_div(c+"_"+i).innerHTML;
						celdasTriqui[cont] = c + "_" + i;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
			if(estriqui == true)
			{
				break;
			}
		}
		//Valida las diagonales...
		if(estriqui == false) // if(!estriqui)
		{
			//Buscar las diagonales...
			for(d = 1; d <= 2; d++)
			{
				cont = 0;
				for(i = 0, c = 2; i < 3; i++, c--)
				{
					if(d == 1)//Diaginal de izquierda a derecha...
					{
						valCampo = nom_div(i+"_"+i).innerHTML;
						celdasTriqui[cont] = i + "_" + i;
					}
					else
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
		}
		if(estriqui)
		{
			//Resaltar el triqui...
			var parDatos = "";
			var celda = "";
			for(i = 0; i < 3; i++)
			{
				for(c = 0; c < 3; c++)
				{
					celda = nom_div(i+"_"+c);
					for(d = 0; d < 3; d++)
					{
						parDatos = celdasTriqui[d].split("_");
						if(Number(parDatos[0]) == i && Number(parDatos[1]) == c)
						{
							celda.style.color = "purple";
							celda.style.fontSize = "110px";
							celda.style.borderColor = "pink";
							break;
						}
						else
						{
							celda.style.color = "gray";
							celda.style.fontSize = "20px";
							celda.style.borderColor = "gray"
						} 
					}
				}
			}
		}
		return estriqui;
	}

	//Para hacer la jugada del PC...
	//Se elimina ya que no se jugará contra un PC...
	/*
	function juegaPC()
	{
		//Determinar la ficha que le corresponde al PC en 
		//función a la que tiene el juagdor...
		var fila = 0;
		var columna = 0;
		var pc = 0;
		var fichaPC = 1;
		//var valCampo = "";
		if(fichaJugador == 1)
		{
			fichaPC = 2;
		}
		do
		{
			pc = Math.floor((Math.random() * 9) + 1);
			if(pc <= 3)
			{
				fila = 0;
				columna = pc - 1;
			}
			else
			{
				if(pc <= 6)
				{
					fila = 1;
					columna = pc - 4;
				}
				else
				{
					fila = 2;
					columna = pc - 7;
				}
			}
			console.log("Aleatorio: " + pc + " Fila: " + fila + " columna: " + columna);
			//console.log("Fila: " + fila + " columna: " + columna);
			if(nom_div(fila+"_"+columna).innerHTML == "" && !terminaJuego)
			{
				nom_div(fila+"_"+columna).innerHTML = txtFichas[fichaPC - 1];
				posMinMax(fila, columna, 2);
				procesarJugada(fichaPC);
				break;
			}
		}while(1);
	}
	*/
	//Fin de la jugada del PC...
	/*
	nom_div("seleJugada").addEventListener('change', function(event)
	{
		fichaJugador = Number(this.value);
		console.log("La ficha es: " + txtFichas[fichaJugador - 1]);
	});
	*/
	var limpiaEscenario = function()
	{
		terminaJuego = false;
		var cont = 0;
		for(i = 0; i < 3; i++)
		{
			for(c = 0; c < 3; c++)
			{
				nom_div(i+"_"+c).style.color = "black";
				nom_div(i+"_"+c).style.fontSize = "80px";
				nom_div(i+"_"+c).style.borderColor = "blue";
				nom_div(i+"_"+c).innerHTML = "";
				vectorMinMAX[cont] = 0;
				cont++;
			}
		}
		
		if(turnos % 2 == 0)
		{
			nom_div("inicia").innerHTML = "Inicia el PC";
			juegaPC();
		}
		else
		{
			nom_div("inicia").innerHTML = "Inicia el Humano";
			nom_div("seleJugada").disabled = false;
		}
		turnos++;
	}
	/*
	nom_div("iniJuego").addEventListener('click', function(event)
	{
		limpiaEscenario();
	});
	*/
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}