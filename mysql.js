var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'fajar'
});

connection.connect(function(err){
    if(err) console.log(err)
    else {
        console.log('[INFO] Database connected')
    }
});

module.exports = connection;