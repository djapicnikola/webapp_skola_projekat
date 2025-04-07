const express = require('express');
const mysql2 = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");

// express server
const app = express();
const port = 3002;

// mysql konekcija
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3325sql',
    database: 'DatabaseSkola',
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true
});

// static files
app.use(express.static('public'));
// body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index page
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'html/index.html'));
});

app.get('/djaci', (req, res) => {

    const {
        query: { json }
    } = req;

    if (!json) {
        //stranica
        res.sendFile(path.join(__dirname, 'html/lista_djaka.html'));
    } else {
        //podaci za tabelu
        let str = 'SELECT djak.ID, djak.Ime, djak.Prezime, odeljenje.Naziv ';
        str += 'FROM djak ';
        str += 'INNER JOIN odeljenje ';
        str += 'ON djak.Odeljenje = odeljenje.ID ';
        str += 'ORDER BY djak.ID';

        connection.query(str, (err, rows) => {
            if (err) {
                console.log('Greska upita djaci');
                throw err;
            }
            res.json(rows);
        });
    }

});

app.get('/nastavnicidata', (req, res) => {

    let str = 'SELECT nastavnik.ID, nastavnik.Ime, predmet.Naziv ';
    str += 'FROM nastavnik ';
    str += 'INNER JOIN predmet ';
    str += 'ON nastavnik.Predmet = predmet.ID ';
    str += 'ORDER BY nastavnik.ID';

    connection.query(str, (err, rows, fields) => {
        if (err) {
            console.log('Greska upita nastavnici');
            throw err;
        }
        res.json(rows);
    });

});

app.get('/svaodeljenja', (req, res) => {

    const {
        query: { json }
    } = req;

    if (!json) {
        //stranica
        res.sendFile(path.join(__dirname, 'html/lista_odeljenja.html'));
    } else {
        //podaci za tabelu
        let str = 'SELECT odeljenje.ID, nastavnik.Ime, odeljenje.Naziv ';
        str += 'FROM odeljenje ';
        str += 'INNER JOIN nastavnik ';
        str += 'ON odeljenje.Staresina = nastavnik.ID ';
        str += 'ORDER BY odeljenje.ID';

        connection.query(str, (err, rows) => {
            if (err) {
                console.log('Greska upita odeljenja');
                throw err;
            }
            res.json(rows);
        });
    }

});

app.get('/jednoodeljenje', (req, res) => {

    const {
        query: { V, getDataForOdlj }
    } = req;

    if (V && !getDataForOdlj) {
        //postavljamo broj odeljenja u html fajl
        res.send(fs.readFileSync("html/prikaz_jednog_odeljenja.html").toString().replace("---odeljenje---", V));
    } else if (!V && getDataForOdlj) {
        //podaci za tabelu
        let str = `SELECT djak.ID, djak.Ime as djIme, djak.Prezime, nastavnik.Ime, predmet.Naziv as pNaziv, odeljenje.Naziv `;
        str += `FROM djak INNER JOIN odeljenje ON djak.Odeljenje = odeljenje.ID `;
        str += `INNER JOIN nastavnik ON odeljenje.Staresina = nastavnik.ID `;
        str += `INNER JOIN predmet ON nastavnik.Predmet = predmet.ID `;
        str += `WHERE djak.Odeljenje = ${getDataForOdlj}`;

        connection.query(str, (err, rows) => {
            if (err) {
                console.log('Greska upita odlj');
                throw err;
            }
            let odgovor = {
                odeljenje: req.query,
                djaci: rows
            }
            res.json(odgovor);
        });
    }

});

app.get('/predmetidata', (req, res) => {

    connection.query('SELECT * FROM predmet', (err, rows, fields) => {
        if (err) {
            console.log('Greska upita predmeti');
            throw err;
        }
        res.json(rows);
    });

});

// Manipulating data

app.post('/insertdjak', (req, res) => {

    const ime = req.body.ime;
    const prezime = req.body.prezime;
    const odeljenje = req.body.odeljenje;

    let str = `INSERT INTO djak `;
    str += `(Ime, Prezime, Odeljenje) values `;
    str += `('${ime}', '${prezime}', ${odeljenje})`;

    connection.query(str, (err, rows, fields) => {
        if (err) {
            console.log('Greska pri dodavanju djaka');
            throw err;
        }
        console.log('djak uspesno dodat')
        res.send();
    });

})

app.post('/updatedjak', (req, res) => {

    let kolona = req.body.kolona;
    let newdata = req.body.newdata;
    let updateID = req.body.updateID;

    let str = `UPDATE djak `;
    str += `SET Ime = '${req.body.ime}', `;
    str += `Prezime = '${req.body.prezime}', `;
    str += `Odeljenje = '${req.body.odeljenje}' `;
    str += `WHERE ID = ${req.body.djakID}`;

    connection.query(str, (err, rows, fields) => {
        if (err) {
            console.log('Greska pri izmeni podataka');
            throw err;
        }
        res.sendFile(path.join(__dirname, '/html/lista_djaka.html'));
    });

})

app.delete('/deletedjak/:id', (req, res) => {

    let deleteID = req.params.id;

    let str = `DELETE FROM djak WHERE ID = ${deleteID}`;

    connection.query(str, (err, rows, fields) => {
        if (err) {
            console.log('Greska pri brisanju djaka');
            throw err;
        }
        console.log('djak uspesno ispisan')
    });

    res.send();
})

///
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});