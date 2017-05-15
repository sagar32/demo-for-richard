var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);


app.use(express.static(__dirname));
var usernames = [];
server.listen(process.env.PORT || 3000);

app.get("/", function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

	socket.on('new user', function (data, callback) {

		if (usernames.indexOf(data) != -1) {
			callback(false);
		} else {
			console.log(data);
			callback(true);
			socket.username = data;
			usernames.push({ name: socket.username, time: 0 });
			io.sockets.emit('userJoin', { msg: socket.username + " is joined now....." });
			setInterval(function () {
				if (socket.username) {
					for (var key in usernames) {
						if (usernames[key].name == socket.username) {
							usernames[key].time += 1;
							socket.emit('usernames', usernames);
						}
					}
				}
			}, 1000);
		}
	});

	//update username
	function updateUsernames() {
		io.sockets.emit('usernames', usernames);
	}



	//send message
	socket.on('send message', function (data) {
		io.sockets.emit('new message', { msg: data, user: socket.username });
	});
	function getIndexOfUser(name){
		for (var key in usernames) {
			if (usernames[key].name == name) {
				return key;
			}
		}
	}

	//disconnect user
	socket.on('disconnect', function (data) {
		if (!socket.username) return;
		usernames.splice(getIndexOfUser(socket.username), 1);
		io.sockets.emit('userLeave', { msg: socket.username + " is leave chat....." });
		updateUsernames();
	});
});