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


io.on('connection',(socket)=>{
	console.log('New user connected');

	socket.on('disconnect',()=>{
		console.log('disconnected');
	})


	socket.on('createMsg', (argsm, callback)=>{
		console.log(argsm);
		callback();

		io.emit('newMsg',{
			from: 'User',
			text : argsm.text,
			createdAt: moment().valueOf()
		});
	});

	socket.on('location',(argsm,callback)=>{
		console.log(argsm);
		io.emit('newLocation',{
			from: 'User',
			url: `https://www.google.com/maps?q=${argsm.latitude},${argsm.longitude}`,
			createdAt: moment().valueOf()
			
		})
		callback();
	})

	socket.on('newSS', (argsm)=>{
		console.log(argsm);
	})
});


 server.listen(3000,()=>{
	console.log('Server is running on 3000');
});

