// based on Tom Igoe's "WsServerWithExpress" Project: 
// https://github.com/tigoe/websocket-examples/blob/main/WsServerWithExpress

let socket; // web socket
let outputText = ""; // text to be sent to the server

//interface
let colorPicker;
let messageInput;
let messageSend;
let messageReceived = "";

//raspi variables
let colorMatrix = []; //node-sense-hat wants a 1D array of 64 elements
let ledArray = []; //for displaying/drawing on webpage
let cellSize = 20;
let raspiRotation = {x: 0, y: 0, z: 0};

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(200, 220, 255);

	// interface setup
	colorPicker = createColorPicker(color('green'));
	
	messageInput = createInput("message to send to server");
	messageInput.position(width/20, height/12);
	messageSend = createButton("Send Message");
	messageSend.position(width/20, 2 * height/12);
	messageSend.mousePressed(() => {
		console.log(messageInput.value());
		socket.send(messageInput.value().toString());
//socket.send(JSON.stringify(messageInput.value()));
	});
	textSize(height/20);
	textAlign(LEFT, CENTER);

	colorPicker = createColorPicker(color('green'));
	colorPicker.position(width/4, 5 * height/12);
	rectMode(CENTER);
	stroke(255);

	// variable setup
	for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
			let cell = {
				x: j, //col
				y: i, //row
				//index: j + (i * 8), //reduntant, but for colorMatrix
				c: [0, 0, 0] //color array
			}
			ledArray.push(cell);
			colorMatrix.push([0, 0, 0]);
                }
        }

	// socket setup
	let urlString = window.location.href.replace("https", "wss");
	urlString = urlString.replace("http", "ws");
	socket = new WebSocket(urlString);
	socket.onopen = () => {
		socket.send("hello friend!".toString());
	}
	socket.onmessage = (result) => {
		//messageReceived = result.toString(); 
		console.log(result);
		messageReceived = JSON.stringify(result.data);
	}
}

function draw() {
	background(200, 220, 255);
	textSize(height/50);
	fill(0);
	text("Message from Server:", 2 * width/3, 2 * height/10);
	text(messageReceived, 2 * width/3, 3 * height/10);

	for (let i = 0; i < ledArray.length; i++) {
		let x = width/4 + (ledArray[i].x * cellSize);
		let y = (6 * height/12) + (ledArray[i].y * cellSize);
		let col = color(ledArray[i].c[0], ledArray[i].c[1], ledArray[1].c[2]);
		fill(col);
		rect(x, y, cellSize);
	}
}

function mouseDragged() {
	for (let i = 0; i < ledArray.length; i++) {
		let x = width/4 + (ledArray[i].x * cellSize);
                let y = (6 * height/12) + (ledArray[i].y * cellSize);
		if (dist(mouseX, mouseY, x, y) < cellSize / 2) {
			let newCol = [colorPicker.color().levels[0], colorPicker.color().levels[1], colorPicker.color().levels[2]];
			ledArray[i].c = newCol;
		}
	}
}

function mouseReleased() {
	for (let i = 0; i < ledArray.length; i++){
		colorMatrix[i] = ledArray[i].c;
	}
	socket.send(colorMatrix);
}

