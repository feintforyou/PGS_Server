const db = require('../mySql')
const utils = require('./utils')

function booking(req, res) {
    db.query(`create table if not exists fajar.orders (
        id int primary key auto_increment,
        iduser varchar(255),
        idslot varchar(255),
        startbook varchar(255),
        endbook varchar(255),
        startin varchar(255),
        endin varchar(255),
        status varchar(255),
        datecreated varchar(255)
    )`, (err) => { if (err) throw err })
    // res.json(req.body)
    utils.dbInsert('fajar.orders', req.body, (results) => {
        // db.query(`SELECT * FROM fajar.orders ORDER BY id DESC LIMIT 1`, (err, orderid) => {
        //     if(err) throw err
        //     else {
                // res.json(orderid)
                db.query(`update fajar.slots set status = '2', usedby = '` + req.body.iduser + `' where id = '` + req.body.idslot + `'`, (err, results) => {
                    if(err) throw err
                    else {
                        res.json({
                            status : 'book success',
                            slot : results
                        })
                    }
                })
        //     }
        // })
    })
}

function pictstart(req, res) {
    let iduser = req.param('iduser')
    let imgin = req.param('imgin')
    db.query(`SELECT * FROM orders WHERE iduser = '` + iduser + `' ORDER BY iduser DESC LIMIT 1`, (err, orders) => {
        if(err) throw err
        else{
            db.query(`update fajar.orders set pictstart = '` + imgin + `' where id = '` + orders[0].id + `'`, (err, results) => {
                if(err) throw err
                else{
                    res.json('succes')
                }
            })
        }
    })
}

function pictend(req, res) {
    let iduser = req.param('iduser')
    let imgout = req.param('imgout')
    db.query(`SELECT * FROM orders WHERE iduser = '` + iduser + `' ORDER BY iduser DESC LIMIT 1`, (err, orders) => {
        if(err) throw err
        else{
            db.query(`update fajar.orders set pictend = '` + imgout + `' where id = '` + orders[0].id + `'`, (err, results) => {
                if(err) throw err
                else{
                    res.json(results)
                }
            })
        }
    })
}

module.exports = {
    booking,
    pictstart,
    pictend
}