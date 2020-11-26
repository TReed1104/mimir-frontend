<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Timetables
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" v-for="timetable in this.timetables" :key="'menu_link_' + timetable" class="dropdown-item" :to="{name: 'timetable', params: {timetable: timetable}}">{{timetable.toUpperCase()}}</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                timer: '',
                timetables: []
            }
        },
        methods: {
            GetTimetables() {
                axios.get(this.$store.getters.mimirEndpointTimetables).then(response => {
                    // Clear the room list
                    this.timetables = [];
                    // Use the response to store the routes in the Vuex Store
                    response.data.data.timetables.forEach(function (timetable) {
                        this.timetables.push(timetable.timetable);
                    }, this);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        mounted() {
            this.GetTimetables();
            this.timer = setInterval(this.GetTimetables, 30000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>