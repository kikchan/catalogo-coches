var express = require('express')
var app = express()

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./coches.db"
    }
});

//"capa" web (no aparecen referencias al API de Knex)
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

//"capa" de acceso a datos (no aparecen referencias al API de Express)
//Lista todos los coches
function listarCoches(callback) {
    knex.select().from('Coches')
    .then(function(datos){
      callback(datos)
    })
}

//Lista un coche dado su ID
function listarCocheID(callback, id) {
    knex.select().from('Coches').where('id', id)
    .then(function(datos){
      callback(datos)
    })
}

//Borra un coche dado su ID
function deleteCocheID(callback, id) {
    knex('Coches').where('id', id).del()
    .then(function(){
        callback("Borrado exitosamente!")
    })
}

//Pone el servidor en marcha
app.listen(3000, function(){
    console.log("Esperando peticiones por el puerto 3000")
})
