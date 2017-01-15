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
  database: 'recipebookdb', //env var: PGDATABASE
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
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * FROM recipes', function(err, result){
			if(err){
				return console.error('error running query', err);
			}
			res.render('index', {recipes: result.rows});
			done();
		});
	});
});

app.post('/add', function(req, res){
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("INSERT INTO recipes(name, ingredients, directions) VALUES ($1, $2, $3)", 
			[req.body.name, req.body.ingredients, req.body.directions]);
		
		done();
		res.redirect('/');
	});
});

app.delete('/delete/:id', function(req, res){
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("DELETE FROM recipes WHERE id = $1", 
			[req.params.id]);
		
		done();
		res.sendStatus(200);
	});
});

app.post('/edit', function(req, res){
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("UPDATE recipes SET name = $1, ingredients = $2, directions = $3 WHERE id = $4", 
			[req.body.name, req.body.ingredients, req.body.directions, req.body.id]);
		
		done();
		res.redirect('/');
	});
});

// Server
app.listen(3000, function(){
	console.log('server started on port 3000');
});