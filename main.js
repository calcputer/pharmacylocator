const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const fs = require('fs');
const haversine = require('s-haversine').default;

const port = 3000;
const db = new sqlite3.Database('./pharms.db') 

// localhost:3000/nearestpharmacy?latitude=x&longitude=y
app.get('/nearestpharmacy', (req, res) => {
    getNearestPharm(req.query.latitude, req.query.longitude, res);
});

app.listen(port, ()=>{
    console.log("Listening on port 3000. Go to localhost:3000/nearestpharmacy?latitude=x&longitude=y in your browser (with corresponding values) to use this endpoint.");
});

function getNearestPharm(lat, lon, res){
    let closestPharm = null;
    let closestDistance = null;


    db.all("SELECT * FROM pharmacies", [], function(err, rows){
        rows.forEach(pharmacy => {
            let distanceToPharm = haversine.distance([lat, lon], [pharmacy.latitude, pharmacy.longitude]);
            if(closestDistance == null || distanceToPharm < closestDistance){
                closestPharm = pharmacy;
                closestDistance = distanceToPharm;
            }});

        if(closestPharm != null){
            res.send( {name:closestPharm.pharmacy, address:closestPharm.address, city:closestPharm.city, state:closestPharm.state, zip:closestPharm.zip, distance:metersToMiles(closestDistance) } );
        }
    });
}

function metersToMiles(meters){
    return meters * 0.00062137119224;
}