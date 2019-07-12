const db = require('../mySql')
const utils = require('./utils')

function cekin(req, res) {
    let timeIn = req.query.timein
    let iduser = req.query.iduser
    db.query(`update fajar.orders set startin = '` + timeIn + `' where iduser = '` + iduser + `'`, (err, results) => {
        if(err) throw err
        else {
            db.query(`select * from fajar.orders where iduser = '` + iduser + `'`, (err, results) => {
                res.json(results)
            })
        }
    })
}

function cekout(req, res) {
    let timeout = req.query.timein
    let iduser = req.query.iduser
    db.query(`update fajar.orders set endin = '` + timeout + `' where iduser = '` + iduser + `'`, (err, results) => {
        if(err) throw err
        else {
            res.json(results)
        }
    }) 
}


function cekdate(req, res){
    db.query(`SELECT s.floor, s.slot, s.status, s.usedby, o.startbook, o.endbook, o.startin, o.endin, o.jenis 
    FROM orders o JOIN slots s ON s.id=o.idslot 
    WHERE s.status != '0' AND o.id = (SELECT x.id FROM orders x WHERE x.idslot = s.id ORDER BY x.startbook DESC LIMIT 1)`, (err, results) => {
        if(err) throw err
        else{
            res.json(results)           
        }
    }) 
}

function cekuser(req, res){
    let iduser = req.query.iduser
    db.query(`SELECT orders.id, orders.idslot, orders.startbook, orders.endbook, orders.startin, orders.endin, orders.jenis FROM orders WHERE orders.iduser = '`+ iduser +`' ORDER BY id DESC`, (err, results) => {
        if(err) throw err
        else{
            res.json(results)           
        }
    }) 
}

// function dashboard(req, res){
//     db.query(
//         `select o.mMasuk, o.mKeluar, free.free, isi.isi, book.book, mnl.manual, tap.tap, vip.vip, reg.reguler, cnl.cancel FROM
//         (SELECT COUNT(startin) AS mMasuk,COUNT(endin) AS mKeluar FROM orders) AS o,
//         (SELECT COUNT(STATUS) AS free FROM slots WHERE STATUS = 0)AS free,
//         (SELECT COUNT(STATUS) AS isi FROM slots WHERE STATUS = 1)AS isi,
//         (SELECT COUNT(STATUS) AS book FROM slots WHERE STATUS = 2)AS book,
//         (SELECT COUNT(jenis) AS manual FROM orders WHERE jenis = 'manual') AS mnl,
//         (SELECT COUNT(jenis) AS tap FROM orders WHERE jenis = 'tap') AS tap,
//         (SELECT COUNT(jenis) AS vip FROM orders WHERE jenis = 'vip') AS vip,
//         (SELECT COUNT(jenis) AS reguler FROM orders WHERE jenis = 'reguler') AS reg,
//         (SELECT COUNT(jenis) AS cancel FROM orders WHERE jenis = 'cancel') AS cnl;`, (err, results1) => {
//         db.query(`SELECT s.floor, s.slot, s.status, s.usedby,o.jenis, o.startin, o.endin, o.pictstart, o.pictend
//         FROM orders o JOIN slots s ON s.id=o.idslot 
//         WHERE s.status != '0' AND o.id = (SELECT x.id FROM orders x WHERE x.idslot = s.id ORDER BY x.startbook DESC LIMIT 1)`, (err, results) => {
//         res.json({results,results1})
//         })   
//     })  
// }

function dashboardout(req, res){
    db.query(`SELECT iduser, idslot,startbook ,endbook, startin, endin, jenis, pictstart, pictend FROM orders ORDER BY endin DESC LIMIT 5;`, (err, results) => {
        res.json(results)  
    })  
}

function dashboard(req, res){  // + history out
    db.query(
        `select o.mMasuk, o.mKeluar, free.free, isi.isi, book.book, mnl.manual, tap.tap, vip.vip, reg.reguler, cnl.cancel FROM
        (SELECT COUNT(startin) AS mMasuk,COUNT(endin) AS mKeluar FROM orders) AS o,
        (SELECT COUNT(STATUS) AS free FROM slots WHERE STATUS = 0)AS free,
        (SELECT COUNT(STATUS) AS isi FROM slots WHERE STATUS = 1)AS isi,
        (SELECT COUNT(STATUS) AS book FROM slots WHERE STATUS = 2)AS book,
        (SELECT COUNT(jenis) AS manual FROM orders WHERE jenis = 'manual') AS mnl,
        (SELECT COUNT(jenis) AS tap FROM orders WHERE jenis = 'tap') AS tap,
        (SELECT COUNT(jenis) AS vip FROM orders WHERE jenis = 'vip') AS vip,
        (SELECT COUNT(jenis) AS reguler FROM orders WHERE jenis = 'reguler') AS reg,
        (SELECT COUNT(jenis) AS cancel FROM orders WHERE jenis = 'cancel') AS cnl;`, (err, results1) => {
        db.query(`SELECT s.floor, s.slot, s.status, s.usedby,o.jenis, o.startin, o.endin, o.pictstart, o.pictend
        FROM orders o JOIN slots s ON s.id=o.idslot 
        WHERE s.status != '0' AND o.id = (SELECT x.id FROM orders x WHERE x.idslot = s.id ORDER BY x.startbook DESC LIMIT 1)`, (err, results) => {
            db.query('SELECT iduser, idslot,startbook,endbook, startin, endin, jenis, pictstart, pictend FROM orders ORDER BY endin DESC LIMIT 5', (err, results2) => {
            res.json({results,results1,results2})
            })
        })   
    })  
}

// function dashboard(req, res){
//     db.query(
//         `select o.mMasuk, o.mKeluar, free.free, isi.isi, book.book, mnl.manual, tap.tap, vip.vip, reg.reguler, cnl.cancel FROM
//         (SELECT COUNT(startin) AS mMasuk,COUNT(endin) AS mKeluar FROM orders) AS o,
//         (SELECT COUNT(STATUS) AS free FROM slots WHERE STATUS = 0)AS free,
//         (SELECT COUNT(STATUS) AS isi FROM slots WHERE STATUS = 1)AS isi,
//         (SELECT COUNT(STATUS) AS book FROM slots WHERE STATUS = 2)AS book,
//         (SELECT COUNT(jenis) AS manual FROM orders WHERE jenis = 'manual') AS mnl,
//         (SELECT COUNT(jenis) AS tap FROM orders WHERE jenis = 'tap') AS tap,
//         (SELECT COUNT(jenis) AS vip FROM orders WHERE jenis = 'vip') AS vip,
//         (SELECT COUNT(jenis) AS reguler FROM orders WHERE jenis = 'reguler') AS reg,
//         (SELECT COUNT(jenis) AS cancel FROM orders WHERE jenis = 'cancel') AS cnl;`, (err, results1) => {
//         db.query(`SELECT * from lastupdate`, (err, results) => {
//         res.json({results,results1})
//         })   
//     })  
// }

module.exports = {
    cekin,
    cekout,
    cekdate,
    cekuser,
    dashboard,
    dashboardout
}