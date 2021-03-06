window.onload = function()
{
	inicio();
}
var debug = "";
function inicio()
{
	comparaCeldas = ["posAvismos", "posOro", "posWumpus"];
	mundoGenera = 
	{
		dimensiones : 0, 
		posAvismos : [], 
		posWumpus : [], 
		posOro: [], 
		posAventurero : 0
	}
	var celdas = 4;
	var dimensionesElementos = 64;
	var personajeUbicado = false;
	elementoSelecciona = 0;
	var imgElementos = ["personaje", "avismo", "oro", "wumpus", "borrar"];
	
	var dibujaEscena = function()
	{
		mundoGenera.posAvismos = [];
		mundoGenera.posWumpus = [];
		mundoGenera.posOro = [];
		mundoGenera.posAventurero = 0;
		personajeUbicado = false;
		nom_div("escenario").innerHTML = crea_escenario();
		anchoEscena = celdas * dimensionesElementos;
		nom_div("escenario").style.width = anchoEscena + "px";
	    nom_div("escenario").style.height = anchoEscena + "px";
	    mundoGenera.dimensiones = celdas;
	    for(var i = 0; i < celdas; i++)
		{
			for(var c = 0; c < celdas; c++)
			{
				nom_id = "d_" + i + "_" + c;
				nom_div(nom_id).addEventListener('click', function(event)
				{
					console.log("elemento Selecciona: " + elementoSelecciona);
					if(elementoSelecciona != 0)
					{
						var posCelda = event.target.id;
						var numElemento = posCelda.split("_");
						var fila = Number(numElemento[1]);
						var col = Number(numElemento[2]);
						var ocupado = false;
						var nomOcupa = 0;
						console.log("Fila: " + fila + " Columna: " + col);	
						if(mundoGenera.posAventurero[0] == fila && mundoGenera.posAventurero[0] == col)
						{
							ocupado = true;
						}
						else
						{
							//for(var i in comparaCeldas)
							for(var i = 0; i < comparaCeldas.length; i++)
							{
								//console.log(comparaCeldas[i]);
								for(var c in mundoGenera[comparaCeldas[i]])
								{
									if(mundoGenera[comparaCeldas[i]][c][0] == fila && mundoGenera[comparaCeldas[i]][c][1] == col)
									{
										ocupado = true;
										if(i == 0)
										{
											nomOcupa = c;
										}
										break;
									}
								}
								//if(ocupado == true)
								if(ocupado)
								{
									break;
								}
							}
						}
						if(!ocupado)
						{
							if(elementoSelecciona == 1)//Aventurero...
							{
								if(!personajeUbicado)
								{
									//console.log("Poner al personaje");
									var iDiv = document.createElement('div');
									iDiv.id = 'personaje';
									iDiv.className = 'personaje basepersonaje front_1';
									nom_div("escenario").appendChild(iDiv);
									var posX = col * 64;
									var posY = fila * 64;
									var perHtml = nom_div("personaje");
									perHtml.style.top = posY + "px";
									perHtml.style.left = posX + "px";
									mundoGenera.posAventurero = [fila, col];
									personajeUbicado = true;
									perHtml.addEventListener('click', function(event)
									{
										//console.log("Seleccionado: " + elementoSelecciona);
										if(elementoSelecciona == 5)
										{
											//if(confirm("¿Está seguro de eliminar al personaje"))
											//{
												nom_div("personaje").remove();
												personajeUbicado = false;
												mundoGenera.posAventurero = [];
											//}
										}
									});
								}
							}
							else
							{
								//Avismos...
								if(elementoSelecciona == 2)
								{
									nom_div(posCelda).setAttribute("class", "basemundo avismo");
									mundoGenera.posAvismos.push([fila, col]);
								}
								else
								{
									//Ubicar el oro o al Wumpus...
									if(elementoSelecciona == 3 || elementoSelecciona == 4)
									{
										var iDiv = document.createElement('div');
										var nomDiv = "oro";
										var cantiElemento = mundoGenera.posOro.length;
										if(elementoSelecciona == 4)
										{
											nomDiv = "wumpus";
											cantiElemento = mundoGenera.posWumpus.length;
										}
										iDiv.id = nomDiv + "_" + cantiElemento;
										iDiv.className = "basemundo " + nomDiv + " basewumpus";
										nom_div("escenario").appendChild(iDiv);
										var posX = col * 64;
										var posY = fila * 64;
										var nomHtml = nom_div(nomDiv+"_"+cantiElemento);
										nomHtml.style.top = posY + "px";
										nomHtml.style.left = posX + "px";
										if(elementoSelecciona == 3)
										{
											mundoGenera.posOro.push([fila, col]);
										}
										else
										{
											mundoGenera.posWumpus.push([fila, col]);
										}
										nomHtml.addEventListener('click', function(event)
										{
											if(elementoSelecciona == 5)
											{
												var elementoSel = event.target.id;
												var parElemento = elementoSel.split("_");
												if(parElemento[0] === "oro")
												{
													if(mundoGenera.posOro.length > 1)
													{
														mundoGenera.posOro.splice(Number(parElemento[1]), 1);
													}
													else
													{
														mundoGenera.posOro = [];
													}
												}
												else
												{
													if(mundoGenera.posWumpus.length > 1)
													{
														mundoGenera.posWumpus.splice(Number(parElemento[1]), 1);
													}
													else
													{
														mundoGenera.posWumpus = [];
													}
												}
												nom_div(elementoSel).remove();
											}
										});
									}
								}
							}
						}
						else
						{
							if(elementoSelecciona == 5)
							{
								nom_div(posCelda).setAttribute("class", "basemundo piso");
								mundoGenera.posAvismos.splice(nomOcupa, 1);
							}
						}
					}
				});
			}
		}
	}

	function crea_escenario ()
	{
		var txt = "<table id='chess_board' cellpadding = '0' cellspacing='0'>";
		var nom_id = "";
		var estilo = "basemundo piso";
		for(var i = 0; i < celdas; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < celdas; c++)
			{
				nom_id = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_id)+"' class = '"+(estilo)+"'></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}

	var dibujaElementos = function()
	{
		var txt = "";
		var opciones = ["avismo", "oro", "wumpus"];
		var cont = 2;
		//Primero el personaje...
		txt += "<div id = 'elemento_1' class = 'personaje basepersonaje front_1' style = 'cursor:pointer;' title = 'Personaje'></div>";
		for(var i in opciones)
		{
			txt += "<div id = 'elemento_"+(cont)+"' class = 'basemundo "+(opciones[i])+"' style = 'cursor:pointer;' title = '"+(opciones[i])+"'></div>";
			cont++;
		}
		txt += "<div id = 'elemento_"+(cont)+"' class = 'borrador' style = 'cursor:pointer;' title = 'Borrar'></div>";
		return txt;
		//Dibujar los elementos que se deberán poner en el escenario...
	}
	
	dibujaEscena();
	nom_div("elementos").innerHTML = dibujaElementos();
	
	//Para adicionar la acciones...
	for(var i = 1; i <= 5; i++)
	{
		nom_div("elemento_" + i).addEventListener('click', function(event)
		{	
			//debug = event;
			var cursorBody = document.getElementsByTagName("body")[0];
			var numElemento = event.target.id.split("_");
			console.log("Presionó en el:" + Number(numElemento[1]));
			cursorBody.style.cursor = "url('imgeditor/"+(imgElementos[numElemento[1] - 1])+".png'), auto";
			//console.log("Num: " + numElemento[1]);
			if(Number(numElemento[1]) === 1) //El personaje...
			{
				if(!personajeUbicado)
				{
					elementoSelecciona = Number(numElemento[1]);
				}
			}
			else
			{
				elementoSelecciona = Number(numElemento[1]);
			}
		});
	}

	nom_div("dimensiones").addEventListener('change', function(event)
    {
        celdas = this.value;
        dibujaEscena();
    });

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}