importScripts('js/pouchdb-7.3.1.min.js')
importScripts('js/sw-db.js')

importScripts('js/sw-utils.js')

const CACHE_STATIC_NAME = 'pwa-static-v1'
const CACHE_DYNAMIC_NAME = 'pwa-dynamic-v1'
const CACHE_INMUTABLE_NAME = 'pwa-inmutable-v1'

const APP_SHELL = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/product.html',
  '/service.html',
  '/team.html',
  '/testimonial.html',
  '/404.html',
  'css/style.css',
  'img/about-1.jpg',
  'img/about-2.jpg',
  'img/carousel-1.jpg',
  'img/carousel-2.jpg',
  'img/product-1.jpg',
  'img/product-2.jpg',
  'img/product-3.jpg',
  'img/service-1.jpg',
  'img/service-2.jpg',
  'img/team-1.jpg',
  'img/team-2.jpg',
  'img/team-3.jpg',
  'img/team-4.jpg',
  'img/testimonial-1.jpg',
  'img/testimonial-2.jpg',
  'img/testimonial-3.jpg',
  'img/testimonial-4.jpg',
  'img/icon.png',
  'js/app.js',
  'js/main.js',
  'js/sw-utils.js',
  'js/sw-db.js',
  '/sw.js',
  'js/camara-class.js',
  'manifest.json'
]

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css',
  'https://code.jquery.com/jquery-3.4.1.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'js/pouchdb-7.3.1.min.js',
  'lib/easing/easing.min.js',
  'lib/wow/wow.min.js',
  'lib/waypoints/waypoints.min.js',
  'lib/counterup/counterup.min.js',
  'lib/owlcarousel/owl.carousel.min.js',
  'lib/owlcarousel/assets/owl.carousel.min.css',
  'lib/animate/animate.min.css',
  'css/bootstrap.min.css',
]

self.addEventListener('install', (evento) => {
  const cacheEstatico = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll(APP_SHELL)
  })

  const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cache) => {
    return cache.addAll(APP_SHELL_INMUTABLE)
  })

  evento.waitUntil(Promise.all([cacheEstatico, cacheInmutable]))
})

self.addEventListener('activate', (evento) => {
  const respuesta = caches.keys().then((llaves) => {
    llaves.forEach((llave) => {
      if (llave !== CACHE_STATIC_NAME && llave.includes('static')) {
        return caches.delete(llave)
      }

      if (llave !== CACHE_DYNAMIC_NAME && llave.includes('dynamic')) {
        return caches.delete(llave)
      }
    })
  })

  evento.waitUntil(respuesta)
})

self.addEventListener('fetch', (e) => {
  let respuesta

  if (e.request.url.includes('/api')) {
    respuesta = manejaPeticionesApi(CACHE_DYNAMIC_NAME, e.request)
  } else {
    respuesta = caches.match(e.request).then((res) => {
      if (res) {
        verificarCache(CACHE_STATIC_NAME, e.request, APP_SHELL_INMUTABLE)
        return res
      } else {
        return fetch(e.request).then((newRes) => {
          return actualizaCache(CACHE_DYNAMIC_NAME, e.request, newRes)
        })
      }
    })
  }

  e.respondWith(respuesta)
})

self.addEventListener('sync', (evento) => {
  //console.log("SW: Sync");

  if (evento.tag === 'nuevo-mensaje') {
    const respuesta = enviarMensajes()
    evento.waitUntil(respuesta)
  }
})