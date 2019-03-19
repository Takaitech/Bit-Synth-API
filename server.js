const express = require('express');
const mongoose = require('mongoose')
const app = express();
const bodyParser  = require('body-parser')
const cors = require('cors');
const {Preset} = require('./model/models');

mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');

app.use(bodyParser.json());

//ERROR HANDLER
app.use(function(err,req,res,next) {
	//console.log(err);
	return res.status(400)

})


app.use(cors());

//USER PRESETS
app.get('/presets',function(req,res) {
  Preset.find({}, function(err, presets){
      if(err){
        console.log(err);
      } else{
          res.send(presets);
          console.log('retrieved presets');
      }
  })
});

//SAVE PRESET
app.post('/presets',function(req,res) {
  console.log(req.body)
  const newPreset = new Preset(req.body);
  newPreset.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newPreset);
  });
});



let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,  { useNewUrlParser: true } , err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
