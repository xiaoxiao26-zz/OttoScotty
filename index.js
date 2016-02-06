var express = require('express')
var Sandbox = require('sandbox')
var cors = require('cors')

var s = new Sandbox()
var app = express()
app.use(cors());
app.set('port', (process.env.PORT || 5000))

app.get('/', function(req, resp) {
  resp.send("Hello Subra Suresh");
});

app.get('/run_javascript', function(req, resp) {
  s.run(req.body.code, function(output) {
    resp.json(output);
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
