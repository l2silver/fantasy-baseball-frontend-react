var path = require('path');
var express = require('express');

var app = express();

app.use('/dist', express.static('dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3030, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3030');
});
