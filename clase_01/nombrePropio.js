function nombrePropio(nombre)
{
	var parteNombre = nombre.split(" ");
	var newNombre = "";
	for(var i = 0; i < parteNombre.length; i++)
	{
		var pl = parteNombre[i].substring(0, 1).toUpperCase();
		var rp = parteNombre[i].substring(1, parteNombre[i].length).toLowerCase();
		if(newNombre != "")
		{
			newNombre += " ";
		}
		newNombre += pl + rp;
	}
	return newNombre;
}
var nombre = "pabLo ErNesto Salazar de LA vEga";
nombre = nombrePropio(nombre);


