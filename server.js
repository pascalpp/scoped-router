var express = require('express'),
var app = express();
var http = require('http');
var httpServer = http.Server(app);

app.use(express.static(__dirname+'/'));

app.get('*', function(req, res){
    res.sendfile(__dirname + '/slides/index.html');
});
app.listen(9000);
