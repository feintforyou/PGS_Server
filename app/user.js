const db = require('../mySql')
const utils = require('./utils')

function create(req, res) {
    db.query(`create table if not exists fajar.users (
        id int primary key auto_increment,
        fullname varchar(255),
        email varchar(255),
        extension varchar(255),
        phone varchar(255),
        password varchar(255),
        address varchar(255),
        codeuser varchar(255),
        rfid varchar(255),
        datecreated varchar(255)
    )`, (err) => { if (err) throw err })
    utils.dbIsExist('fajar.users', 'email', req.body.email, (isExist) => {
        if(isExist == false) { 
            utils.dbInsert('fajar.users', req.body, (err) => {
                if(err) throw err
                else {
                    res.json('Registrasi berhasil')
                }
            })
        }
        else {
            res.json('Email sudah digunakan')
        }
    })
}


function remove(req, res) {
    let email = req.param('email')
    let password = req.param('password')
    utils.auth(email, password, (val) =>{
        if(val == 'sukses') {
            db.query(`delete from fajar.users where email = '`+email+`'`, (err) => {
                if(err) throw err
            })
        }
        res.json({
            status : 'user remove',
            email : email,
            password : password,
            val : val,
        })
    })
}

function update(req, res) {
    utils.dbUpdate('fajar.users', req.query, (results) => {
        res.json(results)
    })
}
function get(req, res) {
    let email = req.param('email')
    let password = req.param('password')
    utils.auth(email, password, (val) =>{
        if(val == 'sukses') {
            db.query(`select * from fajar.users where email = '`+email+`'`, (err, results) => {
                if(err) throw err
                else {
                    res.json(results)
                }
            })
        }
        else {
            res.json(val)
        }
    })
}


function getID(req, res) {
    let code = req.query.code
    db.query(`select id, email from fajar.users where rfid = '`+code+`'`, (err, results) => {
        if(err) throw err
        else {
            res.json(results)
        }
    })
}

module.exports = {
    create,
    remove,
    update,
    get,
    getID,
}
