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
        }).then(response=>response.text()).then(token=> {
            return token
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
        return fetch(this.API_URL + '/cars/' + id)
        .then(response=>response.json()).then(car=> {
            return car
        })
    }

    deleteCar(id, token) {
        return fetch(this.API_URL + '/cars/' + id, {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function(response) {
            if(response.ok)
                return response
        })
    }

    addCar(car) {
        return fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(car)
        }).then(function (response) {
            if (response.ok)
                return response.json()
        })
    }
}