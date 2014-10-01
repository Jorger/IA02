var io = require("socket.io").listen(8088, {log: false});
console.log("Servidor arriba a través del puerto 8088");
io.on("connection", function(socket)
{
	socket.on("nuevoUsuario", function(data)
	{
		//var data = {id: sessionId, sala: sala, idusuario: idUsuario};
		var num_user = 0;
		var participantes = [];
		var room = data.sala;
		var fichaJugador = 1;
		var nomLlega = data.nombre;
		console.log("Nombre llega: " + nomLlega);
		console.log("Valor a guardar: " + data.idusuario);
		//
		socket.set('iduser', [data.idusuario, nomLlega], function()
		{
			//NoSQL... Mongo...
			console.log("Sala es:  "+room+"\r\n");
			socket.join(room);
			for (var ver in pas = io.sockets.clients(room))
			{
				if(num_user < 2)
				{
					console.log("Usuario: " + pas[ver].store.data.iduser[0] + "\n");
					console.log("Nombre: " + pas[ver].store.data.iduser[1] + "\n");
					if(num_user == 1)
					{
						fichaJugador = 2;
					}
					participantes.push({id: pas[ver].store.data.iduser[0], se: pas[ver].id, ficha: fichaJugador, nombre : pas[ver].store.data.iduser[1]});
				}
				num_user++;
			}
			io.sockets.in(room).emit("nuevaConexion", {participantes: participantes, num: num_user, para: data.idusuario});
		});
	});

	socket.on("juega", function(data)
	{
		var room = data.sala;
		io.sockets.in(room).emit("haceJugada", {id : data.id, ficha: data.ficha, f : data.fila, c: data.columna});
	});
});