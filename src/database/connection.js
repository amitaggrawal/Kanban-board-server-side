let mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'kanban';      

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true })
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }

    //Not in use.
    close(){
        var connection = mongoose.connection;
        process.on('SIGINT', function(){
            connection.close(()=>{
              console.log('db connection closed due to process termination');
              process.exit(0);
            });
          });
    }
}

module.exports = new Database()