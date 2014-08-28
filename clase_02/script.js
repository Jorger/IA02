window.onload = function()
{
	inicio();
};

function inicio()
{
	var divElemento = function(nDiv)
	{
		return document.getElementById(nDiv);;
	}
	divElemento("boton1").addEventListener("click", function(e)
	{
		var numUno = prompt("Digite el número uno: ", 0);
		var numDos = prompt("Digite el número dos: ", 0);
		var operador = prompt("Digite el operador: ");
		alert(operar(operador, numUno, numDos));
	});
	var operar = function(operador, numUno, numDos)
	{
		var resultado = 0;
		switch(operador)
		{
			case "+" : resultado = numUno + numDos;
					   break;
			case "-" : resultado = numUno - numDos;
					   break;
			case "*" : resultado = numUno * numDos;
					   break;
			case "/" : resultado = numUno / numDos;
					   break;
			default : console.log("No existe la opción");
		}
		return resultado;
	};
}