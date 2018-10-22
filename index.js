var express = require('express'), bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.json())

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./coches.db"
    },
    
    useNullAsDefault: true
});

/*
* "capa" web (no aparecen referencias al API de Knex)
*/
app.get("/", function(pet, resp) {
    resp.redirect('/cars')
})

//API: get all cars
app.get("/cars", function(pet, resp){
    listarCoches(function(datos){
        resp.send(datos)
    })

})

//API: get car by ID
app.get("/cars/:id", function(pet, resp){
    listarCocheID(function(datos){
        resp.send(datos)
    }, pet.params.id)

})

//API: delete car by ID
app.delete("/cars/:id", function(pet, resp){
    deleteCocheID(function(mensaje){
        resp.send(mensaje)
    }, pet.params.id)
})

//API: post car by ID
app.post("/cars", function(pet, resp) {
    crearCoche(function(mensaje){
        resp.send(mensaje)
    }, pet.body)
})

/*
* "capa" de acceso a datos (no aparecen referencias al API de Express)
*/
//Lista todos los coches
function listarCoches(callback) {
    knex.select().from('Coches')
    .then(function(datos){
        console.log("Listados todos los coches")

        callback(datos)
    })
}

//Lista un coche dado su ID
function listarCocheID(callback, id) {
    knex.select().from('Coches').where('id', id)
    .then(function(datos){
        console.log("Listado coche con ID: " + id)

        callback(datos)
    })
}

//Borra un coche dado su ID
function deleteCocheID(callback, id) {
    knex('Coches').where('id', id).del()
    .then(function(){
        console.log("Borrado coche: " + id)

        callback("Borrado exitosamente!")
    })
}

//Crea un coche nuevo
function crearCoche(callback, coche) {
    knex('Coches').insert(coche).then(function (mensaje) {
        console.log("Insertado coche:")
        console.log("  -"  + coche.marca)
        console.log("  -"  + coche.modelo)
        console.log("  -"  + coche.fecha_matriculacion)
        console.log("  -"  + coche.pais_fabricacion)

        callback("Insertado correctamente")
    })
}

//Pone el servidor en marcha
app.listen(3000, function(){
    console.log("Esperando peticiones por el puerto 3000")
})
