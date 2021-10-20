//basic node server to check connection to/from clients

const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// tell the server where our webpage files are
//app.use(express.static('public'));

// node sensehat led library
const sense = require("sense-hat-led").sync;

//default image to display on start
var X = [0, 0, 255];  // Blue
var O = [100, 100, 100];  // Dim White
var leds = [
X, X, X, X, X, X, X, X,
X, O, O, O, O, O, O, X,
X, O, X, O, O, X, O, X,
X, O, X, O, O, X, O, X,
X, O, X, O, O, X, O, X,
X, O, X, X, X, X, O, X,
X, O, O, O, O, O, O, X,
X, X, X, X, X, X, X, X
];

sense.setPixels(leds);

wss.on('connection', (ws) => {
	console.log('client connected!');

	//send the client a welcome message when first connecting
	ws.send('hello client!');

	//whenever we receive a message from a client, process the data accordingly
	ws.on('message', (e) => {
		let data = JSON.parse(e);

		if (data.type == 'msg') { //when we get a string
			console.log('string received: ' + data.msg);
			sense.showMessage(data.msg);
			ws.send("got your message! :" + data.msg);
		} else if (data.type == 'leds') {
			console.log('leds received');
		 	sense.setPixels(data.leds);
		} else {
			console.log('binary received from client' + Array.from(data).join(","));
		}
	});

	//when a client disconnects, clear up the functions we have associated with them
	ws.on('close', () => {
		console.log('client left');
	});
});

//set up the server, listening on port 8080
server.listen(8080, () => {
	console.log('Server listening on 8080');
});
