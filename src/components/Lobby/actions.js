import io from 'socket.io-client';

var socket = io.connect('localhost:8989');

socket.on('connect',()=>{
	console.log("connected!");
})

socket.on('error',(msg)=>{
	alert(msg);
});

socket.on('createGame',(msg)=>{
	if(msg==='FAILURE'){
		alert('Error: Could not create a game');
	}else{
		window.location = window.location.protocol + "//" + window.location.hostname + ":3000/game/"+msg;
	}
});

socket.open();

export const onJoinLobby = ()=>{
	socket.emit('joinLobby','Joined');
}

export const lobbyFull=(cb)=>{
	socket.on('full',()=>{
		cb();
	});
};

export const lobbyHasRoom = (cb)=>{
	socket.on('room',()=>{
		cb();
	});
};

export const onReceiveGames = (cb)=>{
	socket.on('games',(msg)=>{
		cb(msg);
	});
};

export const onReceiveGame = (cb)=>{
	socket.on('game',(msg)=>{
		cb(msg);		
	});
};

export const createGame =()=>{
	console.log("sending a game creation request!");
	socket.emit('createGame','Creating a game...');
};		


	

		

		

		

		
		