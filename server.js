const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const cors = require('cors')

app.use(express.static('public'));
app.set('view engine', 'ejs')
const db = low(adapter);
app.use(bodyParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  let url = `https://j9l4zglte4.execute-api.us-east-1.amazonaws.com/api/ctl/weather`
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    }
    else {
      let weather = JSON.parse(body)
      if(weather.today == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
      else {
        //let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weather.today, error: null});
      }
    }
  });
});

app.post('/signup',function(req,res) {

  let useremail = req.body.inputEmail;
  let zipCode = req.body.zipCode;
  let date = new Date();

  db.get('customers')
  .push({ email:useremail, zipCode:zipCode, date:date })
  .write();
  db.update('customersCount', n => n + 1)
    .write();
    let url = `https://j9l4zglte4.execute-api.us-east-1.amazonaws.com/api/ctl/weather`
    request(url, function (err, response, body) {
      if(err){
        res.render('home', {weather: null, error: 'Error, please try again'});
      }
      else {
        let weather = JSON.parse(body);
        if(weather.today == undefined){
          res.render('home', {weather: null, error: 'Error, please try again'});
        }
        else {
          //let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('home', {weather: weather.today, error: null});
        }
      }
    });
});

app.post('/', function (req, res) {
  let url = `https://j9l4zglte4.execute-api.us-east-1.amazonaws.com/api/ctl/weather`
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    }
    else {
      let weather = JSON.parse(body);
      if(weather.today == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
      else {
        //let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weather.today, error: null});
      }
    }
  });
})

app.get('/trackUser', function(req,res){
  let email = req.query.inputEmail;
  let zipCode = req.query.zipCode;
  let date = new Date();

  // Set a user using Lodash shorthand syntax
  db.get('usersTracked')
  .push({ email:email, zipCode:zipCode, date:date })
  .write();
  db.update('trackedCount', n => n + 1)
    .write();
  res.json("Successful");
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


