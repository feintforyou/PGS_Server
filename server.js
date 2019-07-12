const express = require('express');
const app = express();
//form
const bodyParser = require('body-parser')
var logger = require('morgan')
var methodOverride = require('method-override')
var fs = require('fs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({limit: '50000kb'}));
app.use(bodyParser.urlencoded({limit: '50000kb', extended: true, parameterLimit: 50000}));

app.use(methodOverride());
//cors
var cors = require('cors')
app.use(cors())
const db = require('./mySql')

app.get('/', (req, res) => {
    res.json('hehe')
})

const user = require('./app/user')
app.post('/user/create', user.create)
app.get('/user/remove', user.remove)
app.get('/user/update', user.update)
app.get('/user/detail', user.get)
app.get('/user/id', user.getID)

const slot = require('./app/slot')
app.post('/slot/create', slot.create)
app.get('/slot/details', slot.details)

const order = require('./app/order')
app.post('/order/book', order.booking)
app.get('/order/pictstart', order.pictstart)
app.get('/order/pictend', order.pictend)

const check = require('./app/check')
app.get('/check/in', check.cekin)
app.get('/check/out', check.cekout)
app.get('/check/date', check.cekdate)
app.get('/check/user', check.cekuser)
app.get('/check/dashboard', check.dashboard)
app.get('/check/dashboardout', check.dashboardout)


const park = require('./app/parking')
app.get('/parking/check/in/tap', park.checkinTap)
app.get('/parking/check/in/manual', park.checkinManual)
app.get('/parking/check/in/qr', park.checkinQr)
app.get('/parking/check/out', park.checkout)


app.get('/parking/status', (req, res) => {
    db.query('select * from fajar.slots', (err, results) => {
        if(err) throw err
        else {
            res.json(results)
        }
    })
})

const utils = require('./app/utils')
app.get('/view', (req, res) => {
    utils.auth(req.query.email, req.query.pass, (auth) => {
        if(auth == 'sukses') {
            db.query(`select * from fajar.users where email = '` + req.query.email + `'`, (err, results) => {
                if(err) throw err
                else {
                    let data = {
                        status : req.query.status,
                        detail : results[0]
                    }
                    res.json(data)
                }
            })
        }
        else {
            res.json(auth)
        }
    })
})



app.post("/postIn",(req,res)=>{
    let iduser = req.body.iduser
    let path = req.body.path
    // let filename = req.body.filename
    let img = req.body.img

    db.query(`SELECT * FROM orders WHERE iduser = '` + iduser + `' ORDER BY id DESC LIMIT 1`, (err, orders) => {
        if(err) throw err
        else{
            db.query(`update fajar.orders set pictstart = '` + img + `' where id = '` + orders[0].id + `'`, (err, results) => {
                if(err) throw err
                else{
                    res.json('succes')
                }
            })
        }
    })
})



app.post("/postOut",(req,res)=>{
    let iduser = req.body.iduser
    let path = req.body.path
    // let filename = req.body.filename
    let img = req.body.img

    db.query(`SELECT * FROM orders WHERE iduser = '` + iduser + `' ORDER BY id DESC LIMIT 1`, (err, orders) => {
        if(err) throw err
        else{
            // console.log(orders[0])
            db.query(`update fajar.orders set pictend = '` + img + `' where id = '` + orders[0].id + `'`, (err, results) => {
                if(err) throw err
                else{
                    res.json('succes')
                }
            })
        }
    })
})



// app.post("/postIn",(req,res)=>{
//     let iduser = req.body.iduser
//     let path = req.body.path
//     // let filename = req.body.filename
//     let img = req.body.img

//     db.query(`SELECT * FROM orders WHERE iduser = '` + iduser + `' ORDER BY id DESC LIMIT 1`, (err, orders) => {
//         if(err) throw err
//         else{
//             db.query(`update fajar.orders set pictstart = '` + path + `' where id = '` + orders[0].id + `'`, (err, results) => {
//                 if(err) throw err
//                 else{
//                     res.json('succes')
//                 }

//             data = img
//                 fs.writeFile(path, base64Data, 'base64', function(err) {
//                 fs.writeFile(path, data, function(err) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         console.log("The file was saved!");
//                     }
//                 });
            
//             })
//         }
//     })
// })



// app.post("/postOut",(req,res)=>{
//     let iduser = req.body.iduser
//     let path = req.body.path
//     // let filename = req.body.filename
//     let img = req.body.img

//     db.query(`SELECT * FROM orders WHERE id = '` + iduser + `' ORDER BY iduser DESC LIMIT 1`, (err, orders) => {
//         if(err) throw err
//         else{
//             db.query(`update fajar.orders set pictend = '` + path + `' where id = '` + orders[0].id + `'`, (err, results) => {
//                 if(err) throw err
//                 else{
//                     res.json('succes')
//                 }

//             data = img
//                 fs.writeFile(path, data, function(err) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         console.log("The file was saved!");
//                     }
//                 });
            
//             })
//         }
//     })
// })

app.listen(14045)