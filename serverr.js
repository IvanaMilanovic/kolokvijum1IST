const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('query-string');
const PATH = "www/";
let artikkli= [
    {
        "id": 1,
        "naziv": "Cips",
        "cena": 54,
        "imeKopmanije": "twix"
    },
    {
        "id": 2,
        "naziv": "koka kola",
        "cena": 554,
        "imeKopmanije": "stark"

    },
    { "id": 3,
        "naziv": "smoki",
        "cena": 5334,
        "imeKopmanije": "stark"

    }
];

http.createServer(function (req, res) {
    let urlObj = url.parse(req.url, true, false);
    if (req.method == "GET") {
        if (urlObj.pathname == "/svi-artikli") {
            response = sviArtikli();
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi artikli</title>
                    <style>
                        table, th, td {
                            border: 1px solid black;
                        }
                        th,td {
                            padding: 5px 12px;
                        }
                    </style>
                </head>
                <body>
                    <h3>Svi artikli</h3>
                    <a href="/dodaj-artikl">Dodaj artikl</a>
                    <br>
                    <br>
                    <div id="prikaz">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>naziz</th>
                                    <th>cena</th>
                                    <th>Ime kompanije</th>
                                    <th>Izmena</th>
                                    <th>Brisanje</th>
                                </tr>
                            </thead>               
                            <tbody>
            `);
            for (let o of response) {
                res.write(`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.naziv}</td>
                        <td>${o.cena}</td>
                        <td>${o.imeKopmanije}</td>
                        <td><a href='/izmeni-artikl?id=${o.id}'>Izmeni artikl</a></td>
                        <td>
                            <form action='/obrisi-artikl' method='POST'>
                                <input type='hidden' name='id' value='${o.id}'>
                                <button type='submit'>Brisanje artikla</button>
                            </form>
                        </td>
                    </tr>
                `);
            }
            res.end(`
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/proba") {
            res.writeHead(302, {
                'Location': '/svi-artikli'
            });
            res.end();
        }
        if (urlObj.pathname == "/izmeni-artikl") {
            let artikl = artikkli.find(x => x.id == urlObj.query.id);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Izmeni artikl</title>
                </head>
                <body>
                    <h3>Izmeni artikl</h3>
                    <a href="/svi-artikli">Svi artikli</a>
                    <br><br>
                    <form action='/izmeni-artikl' method='POST'>
                        ID: <input type='number' name='id' value='${artikkli.id}' readonly><br><br>
                        NAZIV: <input type='text' name='naziv' value='${artikkli.naziv}'><br><br>
                        CENA: <input type='text' name='cena' value='${artikkli.cena}'><br><br>
                        IME KOMPANIJE: <input type='imeKompanije' name='artikl' value='${artikkli.imeKopmanije}'><br><br>
                        <button type='submit'>IZMENI ARTIKL</button>
                    </form>
                </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/dodaj-artikl") {
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dodaj artikl</title>
                </head>
                <body>
                    <h3>Dodaj artikl</h3>
                    <a href="/svi-artikli">Svi artikle</a>
                    <br><br>
                    <form action='/dodaj-artikl' method='POST'>
                        ID: <input type='number' name='id'><br><br>
                        NAZIV: <input type='text' name='ime'><br><br>
                        CENA: <input type='number' name='cena'><br><br>
                        IME KOMPANIJE: <input type='text' name='imeKompanije'><br><br>
                        <button type='submit'>DODAJ ARTIKL</button>
                    </form>
                </body>
                </html>
            `);
        }
    } else if (req.method == "POST") {
        if (urlObj.pathname == "/izmeni-artikl") {
            let body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                izmeniArtikl(querystring.parse(body).id, querystring.parse(body).naziv,querystring.parse(body).cena,querystring.parse(body).imeKompnanije)
                res.writeHead(302, {
                    'Location': '/svi-artikli'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/obrisi-artikl") {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                obrisiArtikl(querystring.parse(body).id)
                res.writeHead(302, {
                    'Location': '/svi-artikli'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/dodaj-artikl") {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                dodajArtikal(querystring.parse(body).id, querystring.parse(body).naziv,
                    querystring.parse(body).cena, querystring.parse(body).imeKompanije);
                res.writeHead(302, {
                    'Location': '/svi-artikli'
                });
                res.end();
            });
        }
    }
}).listen(4500);

function sviArtikli(imeKopmanij) {
    let pomocni = []
    for (let i = 0; i < artikkli.length; i++)
        if (artikkli[i].imeKopmanije=imeKopmanij)
        { pomocni.push(artikkli[i])
    artikkli=pomocni;
            return artikkli;}
    else
        return artikkli;

}

function izmeniArtikl(id, naziv,cena,imeKompanije) {
    for (let i = 0; i < artikkli.length; i++) {
        if (artikkli[i].id == id) {
                artikkli[i].naziv = naziv
            artikkli[i].cena = cena
            artikkli[i].imeKopmanije = imeKompanije
        }
    }
}

function obrisiArtikl(id) {
    let pomocni = []
    for (let i = 0; i < artikkli.length; i++) {
        if (artikkli[i].id != id) {
            pomocni.push(artikkli[i])
        }
    }
    artikkli = pomocni
        return artikkli;
}

function dodajArtikal(id, naziv, cena, imeKompanije) {
    let artikl = {
        'id': id,
        'naziv': naziv,
        'cena': cena,
        'imeKopmanije': imeKompanije
    };
    artikli.push(artikl);
}