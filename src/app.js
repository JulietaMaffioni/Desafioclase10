import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http'; 
import __dirname from './utils.js'

import routerViews from './routes/views.router.js';
import routerProducts from './routes/products.router.js'; 
import routerCarts from './routes/carts.router.js'; 

const app = express();


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


app.use(express.static(__dirname + '/public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routerViews);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);


const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);


socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');
});


const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});



export { socketServer };