//import { open } from 'sqlite'

const sqlite3 = require('sqlite3');
const fs = require('fs');
const db = new sqlite3.Database('./pharms.db') 
 

db.run("CREATE TABLE pharmacies (pharmacy TEXT NOT NULL, address TEXT NOT NULL, city TEXT, state TEXT, zip TEXT, latitude REAL NOT NULL, longitude REAL NOT NULL)");


fs.readFile('pharmacies.csv', 'utf8', function(error, data){
    parsePharmacies(data)
});

function parsePharmacies(data){
    let pharmacies = data.split('\r\n');
    pharmacies.shift();
    console.log(pharmacies[0]);
    pharmacies.forEach(pharmacy => {
        insertPharmacyIntoDatabase(pharmacy)
    });
}

function insertPharmacyIntoDatabase(pharmacy){ 
    let data = pharmacy.split(",");
    if(data.length < 7){ //dont insert pharmacy into database if not formatted correctly
        return;
    }
    //console.log(data)
    //console.log(scrubString(data[1]), '\n');
    db.run("INSERT INTO pharmacies VALUES (?, ?, ?, ?, ?, ?, ?)", 
        scrubString(data[0]), //pharmacy
        scrubString(data[1]), //address
        scrubString(data[2]), //city
        scrubString(data[3]), //state
        data[4], //zip
        parseFloat(data[5]), //latitude
        parseFloat(data[6]) //longitude
        )
}

function scrubString(s){
    return s.substring(1, s.length - 1).trim();
}