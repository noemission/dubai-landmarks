require('dotenv').config()
const express = require('express');
const path = require('path');
const ParseServer = require('parse-server').ParseServer;
const app = express();
const compression = require('compression')

const api = new ParseServer({
  databaseURI: process.env.DB_URI,
  cloud: path.resolve(process.env.CLOUD_PATH),
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
});

app.use(compression())
app.use(express.static('client/dist'))
app.use('/parse', api);
app.get('*', (req, res, next) => {
    res.sendFile(path.resolve('./client/dist/index.html'))
})
app.listen(process.env.SERVER_PORT, function() {
  console.log('server running on port ' + process.env.SERVER_PORT);
});