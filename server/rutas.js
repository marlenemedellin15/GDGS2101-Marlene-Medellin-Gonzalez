const express = require('express')
const router = express.Router()
const push = require('./push')

const mensajes = [
  {
    _id: '2',
    user: 'Marlene Medellin',
    mensaje: 'Prueba 2',
  },
  {
    _id: '1',
    user: 'Creado por',
    mensaje: 'Marlene Medellin Gonzalez',
  },
]

// PETICIONES GET
router.get('/', (req, resp) => {
  resp.json(mensajes)
})

// PETICIONES POST
router.post('/', function (req, resp) {
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user,
    foto: req.body.foto,
  }

  mensajes.push(mensaje)

  console.log('Mis mensajes:', mensajes)

  resp.json({
    ok: true,
    mensaje,
  })
})

//NOTIFICACIONES PUSH

// Almacenar la key
// 1.- Para generar las llaves debes instalar desde tu consola: npm i web-push --save
// 2.- Agregar en el package.json en el apartado de scripts: "generate-vapid": "web-push generate-vapid-keys --json > server/vapid.json"
// 3.- Desde la consola ejecuta el comando: npm run generate-vapid
// 4.- Agregar el archivo push.js en la carpeta server
router.get('/key', (req, res) => {
  const key = push.getKey()
  res.send(key)
})

// Almacenar la suscripción
router.post('/subscribe', (req, res) => {
  const subscripcion = req.body
  push.addSubscription(subscripcion)
  res.json('suscribe')
})

// Enviar una notificación PUSH
// ES ALGO que se controla del lado del server
// se puede activar desde postman enviando una peticion post localhost:3000/api/push -> body -> x-www-form-urlencoded
// {
//  "titulo": "Saludos",
//  "cuerpo": "Aqui va el mensaje que se quiere enviar",
//  "usuario": "vegeta"
// }
router.post('/push', (req, res) => {
  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario,
  }
  push.sendPush(post)
  res.json(post)
})

module.exports = router
