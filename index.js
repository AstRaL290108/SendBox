const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

const node_mysql = require('./node_mysql.js');
const db = new node_mysql("127.0.0.1", "root", "send_box", "root", 3306);

// project setting
app.use(require('express').static(__dirname + '/static/'));
app.set("view engine", "ejs");
app.use(cookieParser('secret key'));

app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	    cb(null, './static/src/user-avatar/');
	},
	filename: function (req, file, cb) {
		let name = `${req.body.login}.${file.originalname.split(".")[1]}`;
	    cb(null, name);
	}
});
var upload = multer({ storage: storage });


server.listen(8080, () => {
	console.log("Сервер запущен -- http://localhost:8080");
});


// http requests
app.get("", (req, resp) => {
	// login, password, avatar, name
	let cookie = req.cookies;
	let keys = Object.keys(cookie).length;

	if (keys < 4) {
		resp.redirect("../../register");
	}else {
		resp.render("pattern.ejs");
	}
});
app.get("/register", (req, resp) => {
	resp.render("registration.ejs");
});
app.get("/singin", (req, resp) => {
	resp.render("singin.ejs");
});


app.post("/server/registration", upload.single('avatar'), (req, resp) => {
	let file = req.file;
	let filename = `${req.body.login}.${file.originalname.split(".")[1]}`;

	fs.renameSync(
		`./static/src/user-avatar/undefined.${file.originalname.split(".")[1]}`, 
		`./static/src/user-avatar/${filename}`
	);

	db.insert_into({
		table: "users", 
		login: req.body.login, 
		password: req.body.password,
		name: req.body.name,
		avatar: filename 
	});

	db.select({table: "users", login: req.body.login}, (err, rows, fields) => {
		resp.send(`Y&#$#&${filename}&#$#&${rows[0].id}`);
	});
})
app.post("/server/singin", upload.single('avatar'), (req, resp) => {
	db.select({
		table: "users", 
		login: req.body.login
	}, (err, rows, fields) => {
		if (rows[0] == undefined) {
			resp.send("None");
		}else {
			if (rows[0].password == req.body.password) {
				resp.send(`${rows[0].avatar}&#$#&${rows[0].name}&#$#&${rows[0].id}`);
			}else {
				resp.send("None");
			}
		}
	});
})


// socket control
io.on('connection', (socket) => {
	socket.on('ping', (req) => {
		db.select_all({table: "messages"}, (err, rows, fields) => {
			socket.emit('get-last', rows);
		});

		req.type = "service-message";
		req.message = `${req.name} присоединился`;
		io.emit('get-message', req);
	});

	socket.on('add-message', (req) => {
		req.type = "user-message";
		io.emit('get-message', req);

		db.select({table: "users", id: req.id}, (err, rows, fields) => {
			db.insert_into({table: "messages", name: rows[0].name, avatar: rows[0].avatar, text_message: req.text});
		});
	});
});