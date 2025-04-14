const tableDjakQuery = 
    `SELECT djak.ID, djak.Ime, djak.Prezime, odeljenje.Naziv
    FROM djak
    INNER JOIN odeljenje
    ON djak.Odeljenje = odeljenje.ID
    ORDER BY djak.ID`;

const tableNastavnikQuery =
    `SELECT nastavnik.ID, nastavnik.Ime, predmet.Naziv
    FROM nastavnik
    INNER JOIN predmet
    ON nastavnik.Predmet = predmet.ID
    ORDER BY nastavnik.ID`;

const svaOdeljenjaQuery = 
    `SELECT odeljenje.ID, nastavnik.Ime, odeljenje.Naziv
    FROM odeljenje
    INNER JOIN nastavnik
    ON odeljenje.Staresina = nastavnik.ID
    ORDER BY odeljenje.ID`;

const jednoOdeljenjeQuery =
    `SELECT djak.ID, djak.Ime as djIme, djak.Prezime, nastavnik.Ime, predmet.Naziv as pNaziv, odeljenje.Naziv
    FROM djak INNER JOIN odeljenje ON djak.Odeljenje = odeljenje.ID
    INNER JOIN nastavnik ON odeljenje.Staresina = nastavnik.ID
    INNER JOIN predmet ON nastavnik.Predmet = predmet.ID
    WHERE djak.Odeljenje = ?`;

module.exports = { tableDjakQuery, tableNastavnikQuery, svaOdeljenjaQuery, jednoOdeljenjeQuery };