var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jwt-simple')
var cors = require('cors')
var app = express()
var payload = {foo: 'bar'}
var secret = Buffer.from('thisIsARandomStringThatImGoingToUseAsASecretWordTo123123123Generate-All-The-Tokens@@.-')

app.use(cors())
app.use(bodyParser.json())                   

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./catalogue.db"
    },
    
    useNullAsDefault: true
});

/*******************************************************************
***************************** WEB LAYER ****************************
*******************************************************************/
app.get("/", function(req, res) {
    res.send("Welcome to Kiril's car catalogue website written in JS and using Express!")
})

app.post("/test", function(req, res) {
    try {
        var header = req.headers['authorization']
        var token = header.split(" ")[1]
    
        if(jwt.decode(token, secret)) {
            //Restore the original DB for testing
            copyFile('./DB backup/catalogue.db', './');
            res.status(200).send('Database restored for testing')
        }
    } catch (error) {
        res.status(400).send("You are not allowed")
    }
})

//API: get all cars
app.get("/cars", function(req, res){

    if(req.query.limit != null && req.query.offset != null) {
        listCarsRange(function(data){
            if(data.length != 0) {
                res.send(data)
            } else {
                res.status(404).send('There are no cars at all!')
            }
        }, req.query.limit, req.query.offset)
    } else {
        listCars(function(data){
            if(data.length != 0) {
                res.send(data)
            } else {
                res.status(404).send('There are no cars at all!')
            }
        })
    }
})

//API: get car by ID
app.get("/cars/:id", function(req, res){
    listCarsByID(function(data){
        if(data.length != 0) {
            res.send(data)
        } else {
            res.status(404).send('Car not found!')
        }
    }, req.params.id)

})

//API: get all available cars
app.get("/available", function(req, res){
    listAvailableCars(function(data) {
        if(data.length != 0) {
            res.send(data)
        } else {
            res.status(404).send('There are no cars available right now!')
        }
    })
})

//API: get all available cars made after a given year
app.get("/available/:year", function(req, res) {
    listAvailableCarsByYear(function(data) {
        if(data.length != 0) {
            res.send(data)
        } else {
            res.status(404).send('No available cars from that year [' + req.params.year + '] and above!');
        }
    }, req.params.year)
})

//API: delete car by ID
app.delete("/cars/:id", function(req, res){
    try {
        var header = req.headers['authorization']
        var token = header.split(" ")[1]
    
        if(jwt.decode(token, secret)) {
            deleteCarByID(function(message){
                res.status(200).send(message)
            }, req.params.id)
        }
    } catch (error) {
        res.status(400).send("You are not allowed")
    }
})

//API: post car
app.post("/cars", function(req, res) {
    try {
        var header = req.headers['authorization']
        var token = header.split(" ")[1]
    
        if(jwt.decode(token, secret)) {
            createCar(function(message){
                res.send(message)
            }, req.body)
        }
    } catch (error) {
        res.status(400).send("You are not allowed")
    }
})

app.post("/cars/:id/upload", function(req, res) {
    console.log("hola")
})

//API: put car
app.put("/cars", function(req, res) {
    try {
        var header = req.headers['authorization']
        var token = header.split(" ")[1]

        if(jwt.decode(token, secret)) {
            editCar(function(message){
                res.send(message)
            }, req.body)
        }
    } catch (error) {
        res.status(400).send("You are not allowed")
    }
})

//API: login
app.post("/login", function(req, res) {
    console.log(req.body)
    
    login(function(result){
        if(result == "Wrong username or password") res.status(403).send(result)
        else res.status(200).send(result)
    }, req.body)
})


/*******************************************************************
************************* PERSISTANCE LAYER ************************
*******************************************************************/
//List all cars
function listCars(callback) {
    knex.select().from('Cars')
    .then(function(data){
        console.log("Showing all cars")

        callback(data)
    })
}

//List all cars from a given range
function listCarsRange(callback, limit, offset) {
    knex.select().from('Cars').limit(limit).offset(offset-1)
    .then(function(data){
        console.log("Showing " + limit + " cars starting from " + offset)

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

//List all available cars made after a given year
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
        console.log("  -"  + car.mileage)
        console.log("  -"  + car.available)
        console.log("  -"  + car.price)

        callback("Successfully inserted")
    })
}

//Edit an existing car
function editCar(callback, car) {
    knex('Cars').where('id', car.id).update(car).then(function (message) {
        callback("Successfully edited")
    })
}

//User login
function login(callback, userData) {
    knex('Users').select().where('username', userData.username).andWhere('password', userData.password).then(function(result) {        
        if(result.length == 1) callback(jwt.encode(payload, secret))
        else callback("Wrong username or password")
    })
}


/*******************************************************************
************************* AUXILIAR METHODS *************************
*******************************************************************/
//Copy the file to dir
var copyFile = (file, dir2)=>{
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');
  
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir2, f));
  
    source.pipe(dest);
    source.on('end', function() { console.log('Succesfully copied'); });
    source.on('error', function(err) { console.log(err); });
};

//Start the server
app.listen(3000, function(){
    console.log("Awaiting for connections through the port: 3000")
})
