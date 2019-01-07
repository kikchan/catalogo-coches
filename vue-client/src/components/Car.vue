<template>
    <tr>
        <td>{{maker}}</td>
        <td>{{model}}</td>
        <td>
            <a class="car_details" v-on:click="detailsCar"> Details </a>
            <a class="car_edit" v-on:click="editCar"> Edit </a>
            <a class="car_delete" v-on:click="deleteCar"> Delete </a>
        </td>
    </tr>
</template>

<script>
    /* eslint-disable */
    import { Service_API } from '../../public/js/services/Service_API.js'
    
    var APIservice = new Service_API('http://localhost:3000')

    export default {
        name: "Car",
        props: ['id', 'maker', 'model', 'year', 'country', 'mileage', 'available', 'price'],
        methods: {
            detailsCar() {
                APIservice.getCar(this.id).then(function (car) {
                    //Plantilla que dibuja una tabla y la rellena con los datos del coche.
                    var carDetails = `
                    <h2 style="border-bottom: solid white 1px">Car details</h2>
                    
                    <table style="width: 100%; color: white">
                        <thead>
                        <tr style="font-weight: bold; color: red; font-size: 20px; text-align: center">
                            <th scope="col">Maker</th>
                            <th scope="col">Model</th>
                            <th scope="col">Year</th>
                            <th scope="col">Country</th>
                            <th scope="col">Mileage</th>
                            <th scope="col">Available</th>
                            <th scope="col">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style="text-align: center">
                            <td>` + car.maker + `</td>
                            <td>` + car.model + `</td>
                            <td>` + car.year + `</td>
                            <td>` + car.country + `</td>
                            <td>` + car.mileage + ` km</td>
                            <td>` + car.available + `</td>
                            <td>` + car.price + ` €</td>
                        </tr>
                        </tbody>
                    </table>
                    `

                    //Recupera el div que muestra los datos del vehículo.
                    var divCarDetails = document.getElementById("carDetails")
                    divCarDetails.innerHTML = carDetails
                })
            },
            editCar: async function() {
                //Primero llama al API para recuperar el coche cuyos datos queremos cambiar.
                await APIservice.getCar(this.id).then(function (car) {
                    //Luego rellena los campos del formulario con los datos recuperados por el API.
                    document.getElementById('maker').value = car.maker
                    document.getElementById('model').value = car.model
                    document.getElementById('year').value = car.year
                    document.getElementById('country').value = car.country
                    document.getElementById('mileage').value = car.mileage
                    document.getElementById('available').value = car.available
                    document.getElementById('price').value = car.price
                })

                //Almacena en Local Storage el ID del coche que queremos editar.
                this.$store.set('carIDtoEdit', this.id)
            },
            deleteCar: async function() {
                await APIservice.deleteCar(this.id, this.$store.get('token'))
                //Llama al API para obtener el listado de todos los coches y lo guarda en la sesión
                this.$store.set('cars', await APIservice.listCars())
                location.reload()
            }
        }
    };
</script>

<style scoped>
    td {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        font-size: 15px;
    }
    
    .car_details {
        color: white;
        text-decoration: unset;
        cursor: pointer;
    }

    .car_details:hover {
        text-decoration: underline;
    }

    .car_delete {
        color: red;
        text-decoration: unset;
        cursor: pointer;
    }

    .car_delete:hover {
        text-decoration: underline;
    }

    .car_edit {
        color: green;
        text-decoration: unset;
        cursor: pointer;
    }

    .car_edit:hover {
        text-decoration: underline;
    }
</style>