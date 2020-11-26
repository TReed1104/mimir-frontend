<template>
    <div id="list-bookings-component" class="container">
        <div v-if="this.timetable != null" id="list-bookings-wrapper">
            <h1 class="page-title">Bookings for {{this.timetable.timetable.toUpperCase()}}</h1>
            <router-link :to="{name: 'Booking Create'}" tag="button" class="btn btn-dark" push>Create Booking</router-link>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
            <br/>
            <br/>
            <div class="scrollable-div-750 black-border">
                <ul class="list-group">
                     <li v-for="booking in this.timetable.bookings" :key="booking.id" class="list-group-item">
                        <div class="col- float-left">
                            <h5>{{ booking.booking }}</h5>
                            <h6>Start: {{ booking.start_time }}</h6>
                            <h6>End: {{ booking.end_time }}</h6>
                            <h6>Duration: {{ booking.duration }} hours</h6>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Booking View', params: {id: booking.id}}" tag="button" class="btn btn-dark" push>View Booking</router-link>
                            <router-link :to="{name: 'Booking Edit', params: {id: booking.id}}" tag="button" class="btn btn-dark" push>Edit Booking</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else id="list-bookings-wrapper">
            <h1 class="page-title">Bookings List</h1>
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
                timetable: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let timetableID = undefined;
                    if (Object.keys(this.$route.params).length != 0) {
                        timetableID = this.$route.params.timetable;
                    }
                    if (timetableID == undefined) {
                        return "No Timetable Selected";
                    }
                    if (this.timetable == null) {
                        return "Timetable not found";
                    }
                }
            }
        },
        methods: {
            GetTimetable() {
                // Reset the timetable variables
                this.loading = true;
                // Get the timetable id from the vue route
                let timetableID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    timetableID = this.$route.params.timetable;
                }
                // If no timetable ID, don't try and get the timetable
                if (timetableID == undefined) {
                    this.timetable = null;
                    this.loading = false;
                    return;
                }
                // Get the Timetable details from Mimir
                axios.get(this.$store.getters.mimirServerAddress + "/timetable_handler?id=" + timetableID)
                .then(response => {
                    this.timetable = response.data.data.timetable;
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
            this.GetTimetable();
            this.timer = setInterval(this.GetTimetable, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>