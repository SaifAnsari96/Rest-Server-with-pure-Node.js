var http = require('http');
var mysql = require('mysql');
var url = require('url');
var querystring = require('querystring');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'demo'
});

connection.connect();

http.createServer(function(req,res){
	var uri = url.parse(req.url,true);
	var path = uri.pathname;
	
	if(req.method == 'GET' && path === '/emp' ){
		if(uri.query.id){
			connection.query('SELECT name from emp where id = ?',uri.query.id, function (error, results) {
				if (error) {
					res.writeHead(400,{'content-type':'application/json'});
					res.end(JSON.stringify(error));
					return
				}
				res.writeHead(200,{'content-type':'application/json'});
				res.end(JSON.stringify(results));						
			});
		}
		else{			
			res.writeHead(400,{'content-type':'application/json'});
			res.end(JSON.stringify({error : 'No ID provided'}));
		}	
	}
	
	else if(req.method === 'POST' && path ==='/emp/insert'){
		
		req.on('data',function(data){
			data = querystring.parse(data.toString('utf-8'));
				
			if(data.id && data.name && data.salary && data.city){
				connection.query('insert into emp values (?,?,?,?)',[data.name,data.city,data.salary,data.id], function (error, results) {
					if (error) {
				
						res.writeHead(400,{'content-type':'application/json'});
						res.end(JSON.stringify(error));
						return
					}
					
					res.writeHead(200,{'content-type':'application/json'});
					res.end(JSON.stringify({Response : 'Success'}));						
				});
			}
		
			else{
				res.writeHead(400,{'content-type':'application/json'});
				res.end(JSON.stringify({error : 'Invalid data provided'}));
			}	
		});
				
	}
	
	else if(req.method == 'GET' && path ==='/emp/delete'){
		if(uri.query.id){
			connection.query('delete from emp where id = ?',uri.query.id, function (error, results) {
				if(error){
					res.writeHead(400,{'content-type':'application/json'});
					res.end(JSON.stringify(error));
					return
				}
				res.writeHead(200,{'content-type':'application/json'});
				res.end(JSON.stringify(results));						
			});
		}
		
		else{

			res.writeHead(400,{'content-type':'application/json'});
			res.end(JSON.stringify({error : 'No ID provided'}));
		}	
	}
	
	else{
		res.writeHead(404,{'content-type':'application/json'});
		res.end('Not Found '+ req.url);
	}
		
}).listen(8000);


