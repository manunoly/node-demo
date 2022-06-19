const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT || 8081;

        this.paths = {
            auth:       '/api/auth',
            check:    '/api/check',
            users:    '/api/users',
        }

        this.conectDB();
        this.middlewares();
        this.routes();
    }

    async conectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.check, require('../routes/check-connection'));
        this.app.use( this.paths.users, require('../routes/users'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running', this.port );
        });
    }

}

module.exports = Server;
