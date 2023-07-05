require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors')
const routes = require('./routes/routing');
const routing = require('./routes/frontRouting');
const connectDB = require('./common/dbConnection');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/', routes);
app.use('/api/v1/', routing);
connectDB();

const server  = http.createServer(app);
const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = process.env.PORT || 1997

server.listen(port, hostname);
server.on('error', onError);
server.on('listening', onListening);

app.get('/', (req, res) => {
    res.send({
        name: 'Portfolio',
        version: '1.0.0',
        author: 'Vishal Soni',
        updated_on: '20 June 2023'
    })
})


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.log(`Listening on http://${hostname}:${port}/`);
}
