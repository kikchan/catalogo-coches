<template>
    <div>
        <h2>Available cars in the catalogue</h2>

        <table class="carTable">
            <thead>
                <tr>
                    <th scope="col">Maker</th>
                    <th scope="col">Model</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in list" :key="i.id">
                    <td>123123</td>
                </tr>
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
        computed: {
            list: async function() {
                await APIservice.listCars().then(function(data) {
                    return data
                })
            }
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
</style>