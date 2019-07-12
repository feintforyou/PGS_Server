const db = require('../mySql')
const utils = require('./utils')

function create(req, res) {
    db.query(`create table if not exists fajar.slots (
        id int primary key auto_increment,
        building varchar(255),
        floor varchar(255),
        slot varchar(255),
        status varchar(255),
        usedby varchar(255)
    )`, (err) => { if (err) throw err })
    let buildingName = req.body.buildingname
    let floorName = req.body.floorname    
    let slotVal = req.body.slotVal
    let query = `insert into fajar.slots (building, floor, slot, status) values `
    for(let i=1; i<=slotVal; i++) {
        if(i != slotVal) {
            query = query.concat(`('`, buildingName, `', '`, floorName, `', '`, i, `', '0'), `)
        }
        else {
            query = query.concat(`('`, buildingName, `', '`, floorName, `', '`, i, `', '0')`)
        }
    }
    utils.dbIsExist('fajar.slots', 'building', buildingName, (buildingExist) => {
        db.query(`select floor from fajar.slots where building = '`+ buildingName + `' and floor = '`+ floorName + `'`, (err, results) => {
            if(err) throw err
            else {
                let floorExist
                if(!results[0]) {
                    floorExist = false
                }
                else {
                    floorExist = true
                }
                if(floorExist == false) {
                    db.query(query, (err, results) => {
                        if(err) throw err
                        else {
                            res.json({
                                building_exist : buildingExist,
                                floor_exist : floorExist,
                                status : 'insert ' + slotVal + ' in building ' + buildingName + ' floor ' + floorName
                            })
                        }
                    })
                }
                else {
                    res.json({
                        building_exist : buildingExist,
                        floor_exist : floorExist,
                        status : 'failed floor exist'
                    })
                }
            }
        })
    })
}

function details(req, res) {
    utils.dbIsExist('fajar.slots', 'building',  req.query.building, (buildingExist) => {
        if(buildingExist == true) {
            utils.dbIsExist('fajar.slots', 'floor', req.query.floor, (floorExist) => {
                if(floorExist == true) {
                    db.query(`select * from fajar.slots where building = '` + req.query.building + `' and floor = '` + req.query.floor + `'`, (err, results) => {
                        if(err) throw err
                        else {
                            res.json(results)
                        }
                    })
                }
                else {
                    res.json('lantai tidak tersedia')
                }
            })
        }
        else {
            res.json('gedung tidak tersedia')
        }
    })
}

module.exports = {
    create,
    details
}