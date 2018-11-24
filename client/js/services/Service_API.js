export class Service_API {
    //Constructor por defecto del API que recibe la URL del servidor.
    constructor(url) {
        this.API_URL = url
    }

    //Función para hacer login. Envía los datos del usuario al API y recibe un token.
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

    //Función para listar todos los coche de la base de datos haciendo una llamada GET al API.
    listCars() {
        return fetch(this.API_URL + '/cars')
        .then(function(response) {
            if(response.ok)
                return response.json()
        })
    }

    //Función para mostrar todos los campos de un coche dado su ID.
    getCar(id) {
        return fetch(this.API_URL + '/cars/' + id)
        .then(response=>response.json()).then(car=> {
            return car
        })
    }

    //Función para borrar un coche dado su ID y hace una llamada DELETE al API para borrarlo.
    //Necesita un token válido para poder hacerlo.
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

    //Función para añadir un coche y hace una llamada POST al API para añadirlo.
    //Necesita un token válido para poder hacerlo.
    addCar(car, token) {
        return fetch(this.API_URL + '/cars', {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(car)
        }).then(function (response) {
            if (response.ok)
                return response.json()
        })
    }

    //Función que recibe un coche y hace una llamada PUT al API para modificarlo.
    //Necesita un token válido para poder hacerlo.
    editCar(car, token) {
        return fetch(this.API_URL + '/cars', {
            method: 'PUT',
            headers: {
                'Content-type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(car)
        }).then(function (response) {
            if (response.ok)
                return response.json()
        })
    }
}