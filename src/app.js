import express from 'express'
import routerViews from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', routerViews)

const httpServer = app.listen(8080, () => {
    console.log('Running...')
})
const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    console.log('nuevo cliente conectado')
})