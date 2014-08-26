function reemplazaPalabra(frase, busca, reemplaza)
{
	var cont = 0;
	do
	{
		if(frase.search(busca) >= 0)
		{
			frase = frase.replace(busca, reemplaza);
		}
		else
		{
			break;
		}
	}while(true);
	return frase;
}
var frase2 = "Hola mundo de este mundo que no es cruel";
frase2 = reemplazaPalabra(frase2, "mundo", "UDEC");