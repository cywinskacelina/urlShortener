'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var body_parser= require('body-parser');
const dns = require('dns');
const valid_url = require("valid-url");
const chars = "abcdefghijklmnopqrstuwxyz123456789";
var Schema = mongoose.Schema;

var cors = require('cors');

const app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
mongoose.connect("mongodb+srv://codyum:appalanchia@cluster0-tfxwi.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

app.use(cors());
app.use(body_parser.urlencoded({extended:false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

let websiteSchema = new Schema({
  address: String,
  shortcut: String
});

const Website = mongoose.model("Website",websiteSchema);

Website.findOne({shortcut: "asdfff"}, function(err, data){
  if(data == null){
    console.log("working properly");
  }
})

function generateId(){ //GENERATE ID
  var temp ="";
  for(var i = 0; i< 8; i++){
    temp += chars.charAt(Math.random()*35);
  }
  return temp;
}



app.route('/api/shorturl/new').post( function(req,res){

  let shortURL = function(url){
    let temp = generateId();
    if(valid_url.isUri(url)){ // WHEN VALID URL

    
    async function getNextIsUniqueIdPromise(web) { // Finds for a unique ID
        let any = await Website.findOne({
          shortcut: web
      }, function (err, docs) {
          if (err) {
              return (err);
          }
          return (docs);    
      });
            if (any == null) {
                return web;
            }else{
              console.log("WHY");
            return getNextIsUniqueIdPromise(generateId());} 
    }
  
    // call it initially with
    getNextIsUniqueIdPromise(temp)
    .then(shortcut => {
      temp = shortcut
     console.log("The shortcut for the url is" + temp);
    })
    .catch(err => {
    console.log("an error occured", err);
    });

      
    Website.create({address: url, shortcut: temp}, function(err, data){
        if(err){
          console.log(err);
        }console.log(data);
        res.json(data);
      });

      console.log("created the model");

    }else{
      return console.log("it is not a valid url");
    }
  };


  shortURL(req.body.url);

});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});



app.get(('/api/:short'), function(req,res){
  var short = req.params.short;
  console.log("asdf"+short);
  Website.findOne({shortcut: short}, function(err,data){
    if(err){
      return console.log(err);
    }
    console.log("HERE");
    res.redirect(301, data.address);
  })
})