<template>
    <div id="availableCarsList" class="availableCarsList">
        <h2>Available cars in the catalogue</h2>

        <table class="carTable">
            <thead>
                <tr>
                    <th scope="col">Maker</th>
                    <th scope="col">Model</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody v-for="i in this.$store.get('cars')" :key="i.id">
                <car 
                    :id="i.id"
                    :maker="i.maker"
                    :model="i.model"
                    :year="i.year"
                    :country="i.country"
                    :mileage="i.mileage"
                    :available="i.available"
                    :price="i.price"/>
            </tbody>
        </table>
    </div>
</template>

<script>
    /* eslint-disable */
    import Car from './Car'
    import { Service_API } from '../../public/js/services/Service_API.js'
    
    var APIservice = new Service_API('http://localhost:3000')

    export default {
        name: "CarList",
        components: {
            Car
        },
        beforeMount: async function() {
            //Llama al API para obtener el listado de todos los coches y lo guarda en la sesión
            await this.$store.set('cars', await APIservice.listCars())
        }
    }
</script>

<style scoped>
  .availableCarsList {
    display: inline;
    text-align: left;
  }

  .carTable {
    width: 100%;
    color: white;
  }

  .carTable thead {
    text-decoration: underline;
    color: red;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }

  h2 {
    border-bottom: solid white 1px;
  }
</style>