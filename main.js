'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const serverPort = 3000;

app.use(express.static('public'));

app.listen(serverPort, function(){
   console.log('Server start')
});

//Weather
function getWeather(res) {
   var key = '4ffccb16-fadd-412b-987a-af0775540229';
   fetch('https://api.weather.yandex.ru/v1/forecast?geoid=16&lang=ru_RU&hours=true&l10n=true&extra=true&limit=7', {
      method: 'get',
      headers: {
         'X-Yandex-API-Key': key
      }
   }).then(function(response) {
      response.json().then(function(data){
         res.send({
            fact: JSON.stringify(data.fact),
            forecasts: JSON.stringify(data.forecasts),
            l10n: JSON.stringify(data.l10n)
         });
      });
   });
}

//Graphcool
const
   gAuth = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTcyMTQ1ODAsImNsaWVudElkIjoiY2ozc2d2Nm8ydnhrNzAxNDhpcXIxeHNociIsInByb2plY3RJZCI6ImNqM3NndjZvMnZ4azYwMTQ4OHp6ZzVnMnQiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqM3Q2d2puZDdhejYwMTU0bjRydm8yYnQifQ.CEYialdPluhVqIoVRnc1Fb_bOvxAQ-nrTAUwXX0is30',
   gUrl = 'https://api.graph.cool/simple/v1/cj3sgv6o2vxk601488zzg5g2t';

function getNotes(res) {
   const query = `
     {
         allNotes {
             id
             text
         }
     }
   `;
    fetch(gUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': gAuth
        },
        body: JSON.stringify({ query })
    }).then(function(response) {
       response.json().then(function(data){
          res.send(JSON.stringify(data.data.allNotes))
       });
    });
}

function setNote(text, res) {
   const query = `
     mutation {
         createNote(
             text: "` + text + `"
         ){
             id
         }
     }
   `;
   fetch(gUrl, {
      method: 'post',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': gAuth
      },
      body: JSON.stringify({ query }),
   }).then(function(response) {
      response.json().then(function(data){
         res.send(JSON.stringify(data.data.createNote))
      });
   })
}

function deleteNote(id, res) {
   const query = `
     mutation {
         deleteNote(
             id: "` + id + `"
         ){
             id
         }
     }
   `;
   fetch(gUrl, {
      method: 'post',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': gAuth
      },
      body: JSON.stringify({ query }),
   }).then(function(response) {
      response.json().then(function(data){
         res.send(JSON.stringify(data.data.deleteNote))
      });
   })
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api', function(req, res){
   switch(req.body.action) {
      case 'set_note':
         setNote(req.body.note_text, res);
         break;
      case 'delete_note':
         deleteNote(req.body.note_id, res);
         break;
      case 'get_notes':
         getNotes(res);
         break;
      case 'get_weather':
         getWeather(req, res);
         break;
   }
});
