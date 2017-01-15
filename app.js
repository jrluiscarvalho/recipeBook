var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();


//DB Config
var config = {
  user: 'luis', //env var: PGUSER
  database: 'recipebook', //env var: PGDATABASE
  password: 'jun10r421', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/layout', function(req, res){
	res.render('layout');
});

// Server
app.listen(3000, function(){
	console.log('server started on port 3000');
});