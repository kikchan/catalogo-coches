export class Service_API {
    constructor(url) {
        this.API_URL = url
    }

    login(user) {
        return fetch(this.API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(response) {
            return response.json()
        })
    }

    listCars() {
        return fetch(this.API_URL + '/cars')
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
}