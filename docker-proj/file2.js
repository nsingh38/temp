var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

///////////////////////////// mySQL /////////////////////////////

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'mysqldb',
	user: 'root',
	password: '1234567890',
	database: '',
	port: '3306',
	multipleStatements: true
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected to mySQL!");
	var sql = "CREATE DATABASE IF NOT EXISTS `docker_proj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci; USE `docker_proj`; CREATE TABLE IF NOT EXISTS `accounts` (id int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARSET=utf8; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234567890'; flush privileges";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Database and table created");
	});
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/sql', function (request, response) {
	var name = request.body.name;
	var email = request.body.email;
	var password = request.body.password;
	if (name && password && email) {
		connection.query('SELECT * FROM accounts WHERE email = ?', [email], function (error, results, fields) {
			if (results.length) {
				response.send('This email is already registered!');
			} else {
				var sql = `INSERT INTO accounts (name, password, email) VALUES ('${name}', '${password}', '${email}')`;
				connection.query(sql, function (error, results, fields) {
					var name = 'hello';
					response.sendFile(path.join(__dirname + '/index.html'));
				});
			}
		});
	}
	else {
		response.send('Please fill all fields!');
		response.end();
	}
});

// ///////////////////////////// redis /////////////////////////////

// const redis = require('redis');
// const client = redis.createClient(6379);
// client.on("error", (error) => {
// 	console.error(error);
// });


// app.post('/redis', async function (req, res) {
// 	await client.connect()
// 	const name = req.body.name;
// 	const email = req.body.email;
// 	const password = req.body.password; 
// 	var data = {"Name" : name, "Email" : email, "Password" : password};
// 	try {
// 		client.get(email, async (err, jobs) => {
// 			if (err) throw err;

// 			if (jobs) {
// 				// res.status(200).send({
// 				// 	jobs: JSON.parse(jobs),
// 				// 	message: "data retrieved from the cache"
// 				// });
// 				console.log("Cache hit")
// 			}
// 			else {
// 				const jobs = data;
// 				client.setex(email, 600, JSON.stringify(jobs));
// 				res.status(200).send({
// 					jobs: jobs,
// 					message: "cache miss"
// 				});
// 			}
// 		});
// 	} catch (err) {
// 		res.status(500).send({ message: err.message });
// 	}
// });


app.listen(3000, () => console.log('Server ready'))