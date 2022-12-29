const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
const indexweb = require('./indexweb');



// default options
//require('dotenv').load();
const app = express();
//app.use(fileUpload());
//app.use(cors())
//app.use('/static', express.static(__dirname + '/uploads'));
//app.use(express.static('dist'));
//Body Parser Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


app.use('/api/web3', indexweb);






app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
//Server port & configuration
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("process.env.ENVIRONMENT", process.env.ENVIRONMENT)

  console.log(`Server is Listening on ${port}`);
});
