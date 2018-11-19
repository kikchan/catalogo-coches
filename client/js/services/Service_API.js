export class Service_API {
    constructor(url) {
        this.API_URL = url
    }

    listCars() {
        return fetch(this.API_URL)
        .then(function(response) {
            if(response.ok)
                return response.json()
        })
    }

    getCar(id) {
        return fetch(this.API_URL + '/' + id)
        .then(function(response) {
            if (response.ok)
                return response.json()
        })
    }

    addCar(car) {
        return fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(car)
        }).then(function (respuesta) {
            if (respuesta.ok)
                return respuesta.json()
        })
    }

    isOK() {
        return fetch(this.API_URL)
        .then(function(response) {
            console.log(JSON.parse(response.body))
            return JSON.parse(response.body) != "" ? true : false
        })
    }
}