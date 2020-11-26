<template>
    <div id="list-timetables-component" class="container">
        <h1 class="page-title">Timetables</h1>
        <div v-if="this.timetables != null" id="list-timetables-wrapper">
            <router-link :to="{name: 'Timetable Create'}" tag="button" class="btn btn-dark" push>Create Timetable</router-link>
            <router-link :to="{name: 'Index'}" tag="button" class="btn btn-dark" push>Back To Home</router-link>
            <br/>
            <br/>
            <div class="scrollable-div-500 black-border">
                <ul class="list-group">
                    <li v-for="timetable in this.timetables" :key="'timetable-link-item-' + timetable.id" class="list-group-item">
                        <div class="col- float-left">
                            <h3>{{ timetable.timetable.toUpperCase() }}</h3>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Timetable View', params: {id: timetable.id}}" tag="button" class="btn btn-dark" push>View Timetable</router-link>
                            <router-link :to="{name: 'Booking List', params: {timetable: timetable.id}}" tag="button" class="btn btn-dark" push>View Bookings</router-link>
                            <router-link :to="{name: 'Timetable Edit', params: {id: timetable.id}}" tag="button" class="btn btn-dark" push>Edit Timetable</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else id="list-timetables-wrapper">
            <router-link :to="{name: 'Timetable Create'}" tag="button" class="btn btn-dark" push>Create Timetable</router-link>
            <br/>
            <br/>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers';
    export default {
        data() {
            return {
                loading: true,
                timetables: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    return "No Timetables Found";
                }
            }
        },
        methods: {
            GetTimetablesList() {
                this.loading = true;
                // Get the list of timetables
                axios.get(this.$store.getters.mimirEndpointTimetables)
                .then(response => {
                    this.timetables = response.data.data.timetables;
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.timetables = null;
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.GetTimetablesList();
            this.timer = setInterval(this.GetTimetablesList, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>
