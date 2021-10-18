//basic node server to check connection to/from clients

const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
	console.log('client connected!');

	//set a repeating function that sends a message to the client every second
	const helloInterval = setInterval(() => {
		ws.send('hello world!')
	}, 1000);
	
	//whenever we receive a message from a client, process the data accordingly
	ws.on('message', (data) => {
		if(typeof(data) == 'string') {
			console.log('client sent: "' + data + '"');
		} else {
			console.log('client sent a non-string message');
		}
	});

	//when a client disconnects, clear up the functions we have associated with them
	ws.on('close', () => {
		console.log('client left');
		clearInterval(helloInterval);
	});
});

//set up the server, listening on port 8080
server.listen(8080, () => {
	console.log('Server listening on 8080');
});
