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
}