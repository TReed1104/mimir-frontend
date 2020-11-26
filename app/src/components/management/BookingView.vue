<template>
    <div id="view-booking-component" class="container">
        <h1 class="page-title">Booking Details</h1>
        <div v-if="this.booking != null" id="view-booking-wrapper">
            <h2>{{this.booking.booking}}</h2>
            <p>
                <b>Timetable: </b>{{this.booking.timetable.toUpperCase()}}<br/>
                <b>Start: </b>{{this.booking.start_time}}<br/>
                <b>End: </b>{{this.booking.end_time}}<br/>
                <b>Duration: </b>{{this.booking.duration}} Hours<br/>
                <b>Colour: </b>{{this.booking.cell_colour.toUpperCase()}}
            </p>
            <br/>
            <router-link :to="{name: 'Booking Edit', params: {id: this.booking.id}}" tag="button" class="btn btn-dark" push>Edit Booking</router-link>
            <router-link :to="{name: 'Booking List', params: {timetable: this.booking.timetable_id}}" tag="button" class="btn btn-dark" push>Back To Booking List</router-link>
        </div>
        <div v-else id="view-booking-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers';
    export default {
        data() {
            return {
                booking: null,
                loading: true,
                timer: ''
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let bookingID = undefined;
                    if (this.$route.params.id != undefined) {
                        bookingID = this.$route.params.id;
                    }
                    if (bookingID == undefined) {
                        return "No Booking Selected";
                    }
                    if (this.booking == null) {
                        return "Booking not found";
                    }
                }
            }
        },
        methods: {
            GetBookingDetails() {
                // Reset the loading state variable
                this.loading = true;

                // Get the booking ID
                let bookingID = undefined;
                if (this.$route.params.id != undefined) {
                    bookingID = this.$route.params.id;
                }

                // If the ID was not set, stop loading and abort the call
                if (bookingID == undefined) {
                    // Cleanup the component data field states
                    this.booking = null;
                    this.loading = false;
                    return;
                }

                // Execute the GET request
                axios.get(this.$store.getters.mimirServerAddress + "/booking_handler?id=" + bookingID)
                .then(response => {
                    // Process the response from the API
                    this.booking = response.data.data.booking;
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error and stop the component data loading
                    console.log(error);
                    this.booking = null;
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.GetBookingDetails();
            this.timer = setInterval(this.GetBookingDetails, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>
