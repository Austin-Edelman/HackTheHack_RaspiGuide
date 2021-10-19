//basic node server to check connection to/from clients

const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// tell the server where our webpage files are
app.use(express.static('public'));

// node sensehat led library
const sense = require("sense-hat-led").sync;

//default image to display on start
var X = [0, 255, 0];  // Green
var O = [255, 255, 255];  // White
var leds = [
O, O, O, O, O, O, O, O,
O, X, X, O, O, X, X, O,
O, X, X, O, O, X, X, O,
O, O, O, O, O, O, O, O,
O, X, O, O, O, O, X, O,
O, X, O, O, O, O, X, O,
O, X, X, X, X, X, X, O,
O, O, O, O, O, O, O, O
];

sense.setPixels(leds);

wss.on('connection', (ws) => {
	console.log('client connected!');

	//send the client a welcome message when first connecting
	ws.send(JSON.stringify(["msg", 'hello client!']));

	//whenever we receive a message from a client, process the data accordingly
	ws.on('message', (e) => {
		let data = JSON.parse(e);
 		if (data[0] == 'leds') { //when we get an led array, display it
			console.log('leds received');
			sense.setPixels(data[1]);
		} else if (data[0] == 'msg') { //when we get a msg string, scroll it
			console.log('msg received');
			let msg = data[1];
			sense.showMessage(msg);
			ws.send(JSON.stringify(["msg", "you sent: " + data[1]]));
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
