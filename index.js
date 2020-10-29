const express = require('express');//just a text
const fs = require('fs').promises;
const Datastore = require('nedb')
const app = express();
let coordArray = [];
let sizeOfDb;
const fetch = require("node-fetch");

app.listen(process.env.PORT||4000, () => console.log('listenin at 4000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


async function getWeather(lat, lon) {

    const api_key = 'ad9e17209860f1f346a1495ea28ca2b2';
    //console.log(lat);
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid='+api_key);

    const weather = await response.json();
    //console.log(weather.main);
    //console.log(weather.main.temp-273.15)
    return [weather.main.temp - 273.15,weather.main.humidity];
}

async function getAQ(lat, lon) {


    //console.log(lat);
    const response = await fetch('https://api.openaq.org/v1/latest?coordinates=' + lat + ',' + lon);

    const AQ = await response.json();
    //console.log(AQ);
    //console.log(weather.main.temp-273.15)
    console.log(AQ);
    if (AQ.results[0]==null)
    return 'error';
    return AQ.results[0].measurements;
}



app.post('/api', async (request, response) => {
    console.log("I got a request");
    //console.log(request.body);


    const weather = await getWeather(request.body.latitude, request.body.longitude);
    request.body.latitude=request.body.latitude.toFixed(2);
    request.body.longitude=request.body.longitude.toFixed(2)
    //console.log(weather);
    request.body.temp = weather[0].toFixed(2);
    request.body.humidity = weather[1].toFixed(2);

    const AQ = await getAQ(request.body.latitude, request.body.longitude);
    //console.log(AQ);
    request.body.AQ=AQ;
    database.insert(request.body);

    response.json({
        status: "success",
        lat: request.body.latitude,
        lon: request.body.longitude,
        weather:request.body.temp,
        humidity:request.body.humidity,
        AQ:request.body.AQ,
    });


    //save data into database.db


})

// No query used means all results are returned (before the Cursor modifiers)



app.get('/api', (request, response) => {

    database.find({}).sort({ timestamp: 1 }).exec(function (err, docs) {

        response.json(docs);
    })



})

