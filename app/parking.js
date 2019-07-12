const db = require('../mySql')
const utils = require('./utils')

function checkinTap(req, res) {
    code = req.query.code
    db.query(`select * from fajar.users where rfid='` + code + `'`, (err, user) => {
        if(err) throw err
        else {
            if(user[0]) {
                db.query(`select * from slots where status = 0`, (err, slots) => {
                    if(err) throw err
                    else {
                        if(slots[0]) {
                            utils.dbInsert('fajar.orders', {
                                iduser : user[0].id,
                                idslot: slots[0].id,
                                startbook: utils.timeStamp(),
                                startin: utils.timeStamp(),
                                jenis: 'tap'
                            }, (err) => {
                                if(err) throw err
                                else {
                                    db.query(`update fajar.slots set status = '1',usedby = '` +user[0].id+ `' where id = '` + slots[0].id + `'`, (err, results) => {
                                        if(err) throw err
                                        else {
                                            res.json({
                                                status: 'access granted',
                                                slot: slots[0].id,
                                                iduser : user[0].id,
                                                email : user[0].email,
                                                pass : user[0].password
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.json({
                                status: 'full',
                            })
                        }
                    }
                })
            }
            else {
                res.json({
                    status: 'access denied',
                })
            }
        }
    })
}

function checkinManual(req, res) {
    utils.dbInsert('fajar.users', {rfid : req.query.code}, (err) => {
        if(err) throw err
        else {
            db.query(`select id from fajar.users order by id desc limit 1`, (req, users) => {
                if(err) throw err
                else {
                    db.query(`select * from slots where status = 0`, (err, slots) => {
                        if(err) throw err
                        else {
                            console.log(users)
                            if(slots[0]) {
                                utils.dbInsert('fajar.orders', {
                                    iduser : users[0].id,
                                    idslot: slots[0].id,
                                    startbook: utils.timeStamp(),
                                    startin: utils.timeStamp(),
                                    jenis : 'manual'
                                }, (err) => {
                                    if(err) throw err
                                    else {
                                        db.query(`update fajar.slots set status = '1',usedby = '` +users[0].id+ `' where id = '` + slots[0].id + `'`, (err, results) => {
                                            if(err) throw err
                                            else {
                                                res.json({
                                                    status: 'access granted',
                                                    slot: slots[0].id,
                                                    iduser : users[0].id,
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: 'full',
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

function checkinQr(req, res) {
    code = req.query.code
    db.query(`select * from fajar.users where rfid='` + code + `'`, (err, user) => {
        if(err) throw err
        else {
            if(user.length > 0) {
                db.query(`select * from fajar.orders where iduser='` + user[0].id + `' and jenis = 'vip' order by id desc`, (err, orders) => {
                    if(err) throw err
                    else {
                        db.query(`update fajar.orders set startin = '`+ utils.timeStamp() +`' where iduser='` + user[0].id + `'`, (err, results) => {
                            if(err) throw err
                            else {
                                db.query(`update fajar.slots set status = '1' where id = '` + orders[0].idslot + `'`, (err) => {
                                    if(err) throw err
                                    else{
                                        res.json({
                                            status : 'access granted',
                                            slot : orders[0].idslot,
                                            in : orders[0].startin,
                                            iduser : user[0].id,
                                            email : user[0].email,
                                            pass : user[0].password
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.json({
                    //status: user,
                    status: 'access denied'
                })
            }
        }
    })
}

// const fs = require('fs-extra')
// const base64ToImage = require('base64-to-image')
// async function gambar(gambar, id, status) {
//     console.log(__dirname)
//     if (!fs.existsSync(__dirname + '/gambar/')) {
//         await fs.mkdirSync(__dirname + '/gambar/')
//     }
//     await fs.mkdirSync(__dirname + '/gambar/' + id)
//     if(status) {
//         await base64ToImage(gambar, __dirname + '/gambar/' + id + '/', {'fileName' : 'in', 'type' : 'jpg'}); 
//     }
//     else {
//         await base64ToImage(gambar, __dirname + '/gambar/' + id + '/', {'fileName' : 'out', 'type' : 'jpg'}); 
//     }
// }

function checkout(req, res) {
    code = req.query.code
    db.query(`select * from fajar.users where rfid='` + code + `'`, (err, user) => {
        if(err) throw err
        else {
            if(user[0]) {
                db.query(`SELECT id FROM orders WHERE iduser=` + user[0].id + ` ORDER BY id DESC LIMIT 1`, (err, order) => {
                    if(err) throw err
                    else {
                        if(order[0]) {
                            if(order[0].endin == null) {
                                db.query(`update fajar.orders set endin = '`+ utils.timeStamp() +`' where id='` + order[0].id + `'`, (err, results) => {
                                    if(err) throw err
                                    else {
                                        db.query(`select * from fajar.orders where id='` + order[0].id + `'`, (err, orders) => {
                                            if(err) throw err
                                            else {
                                                db.query(`update fajar.slots set status = '0', usedby = '0' where id = '` + orders[orders.length-1].idslot + `'`, (err, results) => {
                                                    if(err) throw err
                                                    else {
                                                        res.json({
                                                            status: 'slot clear',
                                                            id : orders[orders.length-1].id,
                                                            iduser : orders[orders.length-1].iduser,
                                                            slot: orders[orders.length-1].idslot,
                                                            in : orders[orders.length-1].startin,
                                                            out: orders[orders.length-1].endin,
                                                            email : order[orders.length-1].email,
                                                            password : orders[orders.length-1].password
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: 'access denied',
                                    slot: '-',
                                    in : '-',
                                    out: '-',
                                })
                            }
                        }
                    }
                })
            }
        }
    })
}

module.exports = {
    checkinTap,
    checkinManual,
    checkinQr,
    checkout
}