const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

var db;
var mySort;
var sort2;

MongoClient.connect('mongodb://localhost', (err, client)=> {
    if(err) return console.log(err)
    db = client.db('examen');
    mySort = { datum_vaststelling: 1 };
    sort2  = {opnameplaats_straat: 1};
    app.listen(3000, function(){
        console.log('listening on 3000.');
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Redirect to list
app.get('/', (req, res) => {
  res.redirect('/list')
})

// List all overtredingen
app.get('/list', (req, res) => {
  db.collection('overtredingen').find().sort(mySort).sort(sort2).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('list.ejs', { overtredingen: result })
  })
})

// Show the search form
app.get('/search', (req, res) => {
  res.render('search.ejs', { overtreding: '' })
})

// Find a overtreding
app.post('/searchByStreet', (req, res) => {
  var input = req.body.opnameplaats_straat;
  db.collection('overtredingen').find({"opnameplaats_straat":input}).toArray(function(err, result) {
    if (err) return console.log(err)
    if (result == '')
        res.render('search_not_found.ejs', {})
    else
        res.render('search_result.ejs', { overtreding: result})
  });
 })

 // Find a overtreding
app.post('/searchBySpeed', (req, res) => {
  var input = req.body.aantal_overtredingen_snelheid;
  input = parseInt(input);
  db.collection('overtredingen').find({"aantal_overtredingen_snelheid": {$gte : input}}).toArray(function(err, result) {
    if (err) return console.log(err)
    if (result == '')
        res.render('search_not_found.ejs', {})
    else
        res.render('search_result.ejs', { overtreding: result })
  });
 })


