var express = require('express'), bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.json())

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./cars.db"
    },
    
    useNullAsDefault: true
});

/*
* WEB LAYER
*/
app.get("/", function(req, res) {
    res.redirect('/cars')
})

//API: get all cars
app.get("/cars", function(req, res){
    listCars(function(data){
        res.send(data)
    })

})

//API: get car by ID
app.get("/cars/:id", function(req, res){
    listCarsByID(function(data){
        res.send(data)
    }, req.params.id)

})

//API: get all available cars
app.get("/available", function(req, res){
    listAvailableCars(function(data) {
        res.send(data)
    })
})

//API: get all available cars greater than a given year
app.get("/available/:year", function(req, res) {
    listAvailableCarsByYear(function(data) {
        res.send(data)
    }, req.params.year)
})

//API: delete car by ID
app.delete("/cars/:id", function(req, res){
    deleteCarByID(function(message){
        res.send(message)
    }, req.params.id)
})

//API: post car by ID
app.post("/cars", function(req, res) {
    createCar(function(message){
        res.send(message)
    }, req.body)
})

//API: put car by ID
app.put("/cars", function(req, res) {
    editCar(function(message){
        res.send(message)
    }, req.body)
})

/*
* PERSISTANCE LAYER
*/
//List all cars
function listCars(callback) {
    knex.select().from('Cars')
    .then(function(data){
        console.log("Showing all cars")

        callback(data)
    })
}

//List a car by its ID
function listCarsByID(callback, id) {
    knex.select().from('Cars').where('id', id)
    .then(function(data){
        console.log("Showing car with ID: " + id)

        callback(data)
    })
}

//List all available cars
function listAvailableCars(callback) {
    knex.select().from('Cars').where('available', 'yes')
    .then(function(data){
        console.log("Showing all available cars")

        callback(data)
    })
}

//List all available cars greater than a given year
function listAvailableCarsByYear(callback, year) {
    knex('Cars').where('available', 'yes')
        .andWhere('year', '>=', year)
        .then(function(data) {
            console.log("Showing all avaialbe cars made after " + year)

            callback(data)
        })
}

//Delete a car given its ID
function deleteCarByID(callback, id) {
    knex('Cars').where('id', id).del()
    .then(function(){
        console.log("Deleted car: " + id)

        callback("Successfully deleted!")
    })
}

//Insert a new car
function createCar(callback, car) {
    knex('Cars').insert(car).then(function (message) {
        console.log("Inserted car:")
        console.log("  -"  + car.maker)
        console.log("  -"  + car.model)
        console.log("  -"  + car.year)
        console.log("  -"  + car.country)

        callback("Successfully inserted")
    })
}

//Edit an existing car
function editCar(callback, car) {
    knex('Cars').where('id', car.id).update(car).then(function (message) {
        console.log("Edited car:")
        console.log("  -"  + car.id)
        console.log("  -"  + car.maker)
        console.log("  -"  + car.model)
        console.log("  -"  + car.year)
        console.log("  -"  + car.country)

        callback("Successfully edited")
    })
}

//Start the server
app.listen(3000, function(){
    console.log("Waiting for connections through the port 3000")
})
