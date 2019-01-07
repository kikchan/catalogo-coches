<template>
    <tr>
        <td>{{maker}}</td>
        <td>{{model}}</td>
        <td>
            <a class="car_details" v-on:click="detailsCar">Details</a>
            <a class="car_edit" v-on:click="editCar">Edit</a>
            <a class="car_delete" v-on:click="deleteCar">Delete</a>
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
            detailsCar: function() {
                APIservice.getCar(this.id).then(function (data) {
                    //Recupera el div que muestra los datos del vehículo.
                    var divCarDetails = document.getElementById("carDetails")
                    //Llama a la plantilla de handlebars con los datos del coche y lo inserta.
                    //divCarDetails.innerHTML = tmpl_carDetails_compiled(data)
                    //Alinea todos los elementos del div a la izquierda.
                    divCarDetails.style.textAlign = "left"
                    //Por último, muestra el contenedor.
                    divCarDetails.style.display = "inline"
                })
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
  }

  .car_details:hover {
    text-decoration: underline;
  }

  .car_delete {
    color: red;
    text-decoration: unset;
  }

  .car_delete:hover {
    text-decoration: underline;
  }

  .car_edit {
    color: green;
    text-decoration: unset;
  }

  .car_edit:hover {
    text-decoration: underline;
  }
</style>