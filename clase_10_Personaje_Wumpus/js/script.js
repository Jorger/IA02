//killall -9 mysqld
window.onload = function()
{
	inicio();
}

function inicio()
{
	function crea_escenario (celdas)
	{
		var txt = "<table id='chess_board' cellpadding='0' cellspacing='0'>";
		var nom_div = "";
		var estilo = "class = 'basemundo piso'";
		for(var i = 1; i <= celdas; i++)
		{
			txt += "<tr>";
			for(var c = 1; c <= celdas; c++)
			{
				nom_div = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_div)+"' "+(estilo)+"></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		txt += "<div id = 'personaje'></div>";
		return txt;
	}

	var numCeldas = 4;
	var anchoCeldas = 64;
	var txtDirecciones = ["Izquierda", "Arriba", "Derecha", "Abajo"]; //37, 38, 39, 40...
	var direcciones = ["left", "top", "right", "front"];
	var direccion = 0;
	var caminar = false;
	var animaMovimiento = false;
	var paso = 1;
	var tiempoAnima = "";

	var dibujaEscena = function()
	{
		var anchoEscenario = numCeldas * anchoCeldas;
		var maxEscena = anchoEscenario - anchoCeldas;
		nom_div("escenario").innerHTML = crea_escenario (numCeldas);
		nom_div("escenario").style.width = anchoEscenario + "px";
	    nom_div("escenario").style.height = anchoEscenario + "px";
	    nom_div("personaje").setAttribute("class", "basepersonaje front_1");
		nom_div("personaje").style.left = "0px"; // X
		nom_div("personaje").style.top = "0px"; // Y
		nom_div("opacidad").value = 1;
		if(tiempoAnima != "")
		{
			clearInterval(tiempoAnima);
		}
		tiempoAnima = setInterval(function()
		{
			if(caminar || animaMovimiento)
			{
				if(paso == 1)
				{
					audios("sounds/pasos.mp3", 1);
				}
				nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_" + paso);
				paso++;
				if(paso >= 5)
				{
					paso = 1;
					if(!caminar)
					{
						audios("", 0);
						animaMovimiento = false;
						nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
					}
				}
				var posX = parseInt(nom_div("personaje").style.left); //Number()...
				var posY = parseInt(nom_div("personaje").style.top); //
				console.log("X = " + posX + " Y = " + posY);
				switch(direccion)
				{
					case 0: posX -= 16; break;
					case 1: posY -= 16; break;
					case 2: posX += 16; break;
					case 3: posY += 16; break;
				}
				if((posX >= 0 && posX <= maxEscena) && (posY >= 0 && posY <= maxEscena))
				{
					nom_div("personaje").style.left = posX + "px";
					nom_div("personaje").style.top = posY + "px";
				}
			}
		}, 100);
	};
	dibujaEscena();
	
	/*
	0 = Izquierda
	1 = Arriba
	2 = Derecha
	3 = Abajo
	*/
	window.onkeydown = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which; 
		console.log("Tecla presionada: " + code);
		//if(caminar == false && animaMovimiento == false)
		if(!caminar && !animaMovimiento)
		{
			if(code >= 37 && code <= 40)
			{
				direccion = code - 37;
				//console.log(txtDirecciones[direccion] + " Y " + direccion);
				animaMovimiento = caminar = true;
			}
		}
	}
	window.onkeyup = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(caminar)
		{
			if(code >= 37 && code <= 40)
			{			
				caminar = false;
			}
		}
	}

	var audios = function(audio, tipo)
	{
		var txt = "";
		var loop = "";
		if(tipo != 0)
		{
			if(tipo == 1)
			{
				loop = "loop";
			}
			txt = "<audio autoplay "+(loop)+">";
			txt += "<source src = '"+(audio)+"' type = 'audio/mpeg'></audio>";
		}
		nom_div("audioFondo").innerHTML = txt;
	}

	nom_div("dimensiones").addEventListener('change', function(event)
    {
        numCeldas = this.value;
        dibujaEscena();
        this.blur();
    });

    nom_div("opacidad").addEventListener('change', function(event)
    {
        var el = document.getElementsByClassName("basemundo");
        for(var i in el)
        {
        	if(el[i].id != undefined)
        	{
        		//console.log(el[i].id);
        		nom_div(el[i].id).style.opacity = this.value;
        	}
        }
        this.blur();
        //el.style.filter = 'alpha(opacity=30)';
    });
    function nom_div(div)
	{
		return document.getElementById(div);
	}
}