<template>
    <div id="view-timetable-component" class="container">
        <h1 class="page-title">Timetable Details</h1>
        <div v-if="this.timetable != null" id="view-timetable-wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.timetable.timetable.toUpperCase() }}<br/>
                ID: {{ this.timetable.id }}
            </p>
            <h2>Bookings</h2>
            <p>
                Count: {{ this.timetable.bookings.length }}
            </p>
            <router-link :to="{name: 'Booking List', params: {timetable: this.timetable.id}}" tag="button" class="btn btn-dark" push>View Bookings</router-link>
            <br/>
            <br/>
            <router-link :to="{name: 'Timetable Edit', params: {id: this.timetable.id}}" tag="button" class="btn btn-dark" push>Edit Timetable</router-link>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
        </div>
        <div v-else id="view-timetable-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                timetable: null,
                loading: true,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let timetableID = undefined;
                    if (this.$route.params.id != undefined) {
                        timetableID = this.$route.params.id;
                    }
                    if (timetableID == undefined) {
                        return "No Timetable Selected";
                    }
                    if (this.room == null) {
                        return "Timetable not found";
                    }
                }
            }
        },
        methods: {
            GetTimetableDetails(){
                // Reset the loading toggle
                this.loading = true;
                // Get the Timetable ID from the Vue route
                let timetableID = undefined;
                if (this.$route.params.id != undefined) {
                    timetableID = this.$route.params.id;
                }
                // If the ID was not attained, stop loading the timetable and return
                if (timetableID == undefined) {
                    this.timetable = null;
                    this.loading = false;
                    return;
                }
                // Get the timetable details from the Mimir API
                axios.get(this.$store.getters.mimirServerAddress + "/timetable_handler?id=" + timetableID)
                .then(response => {
                    this.timetable = response.data.data.timetable
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.timetable = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetTimetableDetails();
            this.timer = setInterval(this.GetTimetableDetails, 60000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
    }
</script>
