var express = require('express')
var app = express()

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./ejemplo.db"
    }
});

//"capa" web (no aparecen referencias al API de Knex)
app.get("/users", function(pet, resp){
    listarUsuarios(function(datos){
        resp.send(datos)
    })

})

//"capa" de acceso a datos (no aparecen referencias al API de Express)
function listarUsuarios(callback) {
    knex.select().from('Usuarios')
    .then(function(datos){
      callback(datos)
    })
}

app.listen(3000, function(){
    console.log("Servidor en marcha!!")
})
