
const express = require('express');
var path = require('path');  

const port = 4200;
const app = express();

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'nr-fom-admin/dist')));

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});


//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'nr-fom-admin/dist/index.html'));
});
