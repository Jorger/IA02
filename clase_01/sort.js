//comparar los valores de array y lo ordenará...
function compara(a, b)
{
	var retorna = 0;
	if(a != b)
	{
		if(a < b)
		{
			retorna = -1;
		}
		else
		{
			retorna = 1;	
		}
	}
	return retorna;
}

b.sort(function(a, b){
	var retorna = 0;
	if(a != b)
	{
		if(a < b)
		{
			retorna = -1;
		}
		else
		{
			retorna = 1;	
		}
	}
	return retorna;
});