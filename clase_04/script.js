//PhoneGAP...
/*
.js
.css
.view
.img
.class
.utils -> Calendarios..

Jquery...
	jqeury UI
	Jquery Mobile
prototype.
mootols...

Minimax -> Triqui...

	Triqui tonto Vs Humano -> 
	Triqui Inteligente Vs HUmano
	Humano Vs Humano -> Sockets...

Poda Alpha Beta -> Ajedrez...
*/
window.onload = function()
{
	divElemento("numImagen").addEventListener("change", function(e)
	{
		if(this.value >= 1 && this.value <= 6)
		{
			var extension = ".png";
			if(this.value == 6)
			{
				extension = ".gif";
			}
			console.log(this.value);
			divElemento("imagenPrueba").src = "img/img_" + this.value + extension;	
			divElemento("imagenPrueba2").src = "img/img_" + this.value + extension;	
		}
	});

	function divElemento(id)
	{
		return document.getElementById(id);
	}
}