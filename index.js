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

app.get("/cars", function(pet, resp){
    listarCoches(function(datos){
        resp.send(datos)
    })

})

app.get("/cars/:id", function(pet, resp){
    listarCocheID(function(datos){
        resp.send(datos)
    }, pet.params.id)

})

//"capa" de acceso a datos (no aparecen referencias al API de Express)
function listarCoches(callback) {
    knex.select().from('Coches')
    .then(function(datos){
      callback(datos)
    })
}

function listarCocheID(callback, id) {
    knex.select().from('Coches').where('id', id)
    .then(function(datos){
      callback(datos)
    })
}

app.listen(3000, function(){
    console.log("Servidor en marcha!!")
})
