const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const app = express();
const moment = require('moment');
const publicPath =  path.join(__dirname, '.', 'public');
app.use(express.static(publicPath))


const server = http.createServer(app);
const io = socketIO(server);


class User {
	constructor () {
		this.users = [];
	}

	addUser (id,name,room) {
		var user = {id, name, room};
		this.users.push(user);
		return user;
	}

	removeUser (id) {
		var user = this.getUser(id);

		if (user) {
			this.users = this.users.filter((user)=> user.id !== id);
		}

		return user;
	} 

	getUser (id) {
		return this.users.filter((user)=> user.id == id)[0];
	}

	getUserList (room) {
		var users = this.users.filter((user)=> user.room == room);
		var nameArray = users.map((user)=> user.name);

		return nameArray;
	}

}


var users = new User();


io.on('connection',(socket)=>{
	console.log('New user connected');
	socket.on('join', (argsm,callback)=>{
		if(!isRealString(argsm.name) || !isRealString(argsm.room)) {
			return callback('Name and room name cannot be empty');
		}

		socket.join(argsm.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, argsm.name, argsm.room)

		io.to(argsm.room).emit('updateUserList', users.getUserList(argsm.room));


		socket.on('createMsg', (argsm, callback)=>{

			var user = users.getUser(socket.id)
			io.to(user.room).emit('newMsg',{
				from : user.name,
				text : argsm.text,
				createdAt: moment().valueOf()
			});
			callback();
		});
	});

	socket.on('location',(argsm,callback)=>{
		var user = users.getUser(socket.id)
		io.to(user.room).emit('newLocation',{
			from: user.name,
			url: `https://www.google.com/maps?q=${argsm.latitude},${argsm.longitude}`,
			createdAt: moment().valueOf()
			
		})
		callback();
	});

	socket.on('disconnect',()=>{
		var user = users.	removeUser(socket.id);
		console.log(user);
		// console.log('disconnected');
		io.to(user.room).emit('updateUserList', users.getUserList(user.room));
	})
});



function isRealString(str) {
	return typeof str === 'string' && str.trim().length > 0;
}






 server.listen(3000,()=>{
	console.log('Server is running on 3000');
});

