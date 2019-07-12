const db = require('../mySql')
const ts = require('time-stamp')

function dbIsExist(table, key, value, callBack) {
    db.query(`select * from ` + table + ` where ` + key + ` = '` + value + `'`, (err, results) => {
        if (err) throw err
        else {
            if (!results[0]) {
                return callBack(false)
            }
            else {
                return callBack(true)
            }
        }
    })
}

function dataGenForDbInsert(data) {
    let hasil = {
        key: null,
        val: null,
    }
    let key = "("
    let val = "("
    let keyArr = Object.keys(data)
    for (let i = 0; i < keyArr.length; i++) {
        if (i < keyArr.length - 1) {
            key = key.concat(keyArr[i], ' ,')
            val = val.concat(`'`, data[keyArr[i]], `', `)
        }
        else {
            key = key.concat(keyArr[i], ', datecreated)')
            val = val.concat(`'`, data[keyArr[i]], `', '`+ timeStamp() +`')`)
        }
    }
    hasil.key = key
    hasil.val = val
    return hasil
}

function dbInsert(table, data, callBack) {
    let dataGen = dataGenForDbInsert(data)
    let query = `insert into ` + table + ` ` + dataGen.key + ` values ` + dataGen.val
    db.query(query, (err) => {
        if(err) throw err
        else {
            return callBack(err)
        }
    })
}

function dbUpdate(table, data, callBack) {
    let keyArr = Object.keys(data)
    let valArr = Object.values(data)
    let query = `update ` + table + ` set`
    for(let i = 0; i<keyArr.length; i++) {
        if(keyArr[i] != 'email') {
            query = query.concat(` `, keyArr[i], ` = '`, valArr[i], `'`)
        }
    }
    query = query.concat(` where email = '`, data.email, `'`)
    db.query(query, (err, results) => {
        if(err) throw err
        else {
            return callBack({
                key : keyArr,
                val : valArr,
                query : query
            })
        }
    })
}

function auth(email, pass, callBack) {
    db.query(`select password from fajar.users where email='`+email+`'`, (err, results) => {
        if(err) throw err
        else {
            if(results != "") {
                if(results[0].password == pass) {
                    return callBack('sukses')
                }
                else {
                    return callBack('password salah')
                }
            }
            else {
                return callBack('tidak terdaftar')
            }
        }
    })
}

function timeStamp() {
    return ts('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
    dbIsExist,
    dbInsert,
    timeStamp,
    auth,
    dbUpdate
}