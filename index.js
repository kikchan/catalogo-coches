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

//API: get all available cars
app.get("/available", function(pet, resp){
    listarCochesDisponibles(function(datos) {
        resp.send(datos)
    })
})

//API: get all available cars from a given year
app.get("/available/:year", function(pet, resp) {
    listarCochesDisponiblesPorAnyo(function(datos) {
        resp.send(datos)
    }, pet.params.year)
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

//API: put car by ID
app.put("/cars", function(pet, resp) {
    editarCoche(function(mensaje){
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
        console.log("Listando todos los coches")

        callback(datos)
    })
}

//Lista un coche dado su ID
function listarCocheID(callback, id) {
    knex.select().from('Coches').where('id', id)
    .then(function(datos){
        console.log("Listando coche con ID: " + id)

        callback(datos)
    })
}

//Lista todos los coches disponibles
function listarCochesDisponibles(callback) {
    knex.select().from('Coches').where('disponible', 'si')
    .then(function(datos){
        console.log("Listando todos los coches disponibles")

        callback(datos)
    })
}

//Lista todos los coches disponibles a partir de un año
function listarCochesDisponiblesPorAnyo(callback, year) {
    knex('Coches').where('disponible', 'si')
        .andWhere('fecha_matriculacion', '>=', year)
        .then(function(datos) {
            console.log("Listando coches disponibles a partir del año " + year)

            callback(datos)
        })
}

//Lista todos los coches a partir de un año dado
function listarCochesDisponibles(callback) {
    knex.select().from('Coches').where('disponible', 'si')
    .then(function(datos){
        console.log("Listando todos los coches disponibles")

        callback(datos)
    })
}

//Borra un coche dado su ID
function deleteCocheID(callback, id) {
    knex('Coches').where('id', id).del()
    .then(function(){
        console.log("Borrando coche: " + id)

        callback("Borrado exitosamente!")
    })
}

//Crea un coche nuevo
function crearCoche(callback, coche) {
    knex('Coches').insert(coche).then(function (mensaje) {
        console.log("Insertando coche:")
        console.log("  -"  + coche.marca)
        console.log("  -"  + coche.modelo)
        console.log("  -"  + coche.fecha_matriculacion)
        console.log("  -"  + coche.pais_fabricacion)

        callback("Insertado correctamente")
    })
}

//Edita un coche existente
function editarCoche(callback, coche) {
    knex('Coches').where('id', coche.id).update(coche).then(function (mensaje) {
        console.log("Editando coche:")
        console.log("  -"  + coche.id)
        console.log("  -"  + coche.marca)
        console.log("  -"  + coche.modelo)
        console.log("  -"  + coche.fecha_matriculacion)
        console.log("  -"  + coche.pais_fabricacion)

        callback("Editado correctamente")
    })
}

//Pone el servidor en marcha
app.listen(3000, function(){
    console.log("Esperando peticiones por el puerto 3000")
})
