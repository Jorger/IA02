//Palíndromos...
//anita lava la tina
var hola = "Hola avion"; //cifrar... search, replace
var mueva = 5;
var cesar = "";
//z + 2 = b
// b - 2 = z
for(var i = 0; i < hola.length; i++)
{
	var tmp = hola.charAt(i);
	var ascii = tmp.charCodeAt() + mueva;
	//console.log(tmp +" = " + tmp.charCodeAt() + " mueve: " + ascii + " = " + letraNueva);
	if(ascii != 32)
	{
		var letraNueva = String.fromCharCode(ascii);
		cesar += letraNueva;
	}
	else
	{
		cesar += " ";
	}
}
console.log("Original: " + hola);
console.log("Cesar: " + cesar);