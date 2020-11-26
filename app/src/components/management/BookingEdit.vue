<template>
    <div id="edit-booking-component" class="container">
        <h1 class="page-title">Edit Booking</h1>
        <div v-if="this.booking != null" id="edit-booking-wrapper">
            <h2>{{this.booking.booking}}</h2>
            <br/>
            <h3>Current Details</h3>
            <p>
                <b>Timetable: </b>{{this.booking.timetable.toUpperCase()}}<br/>
                <b>Start: </b>{{this.booking.start_time}}<br/>
                <b>End: </b>{{this.booking.end_time}}<br/>
                <b>Duration: </b>{{this.booking.duration}} Hours<br/>
                <b>Colour: </b>{{this.booking.cell_colour.toUpperCase()}}
            </p>
            <br/>
            <h3>Edit Details</h3>
            <p>
                Rename Booking:
                <input type="text" class="form-control w-25" placeholder="New Booking Name" @input="OnNewNameChange($event)"/>
                <br/>
                Change Booking Colour:
                <input type="color" class="form-control w-25" :value="this.booking.cell_colour" @input="OnNewColourChange($event)"/>
            </p>
            <br/>
            <button :disabled="disableSubmitButton" class="btn btn-dark" @click="SubmitBookingChanges">Save Changes</button>
            <router-link :to="{name: 'Booking List', params:{ timetable: this.booking.timetable_id }}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
        <div v-else id="edit-booking-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                booking: null,
                loading: true,
                disableSubmitButton: true,
                newBookingName: "default",
                newBookingColour: "default"
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
                    this.newBookingName = this.booking.booking;
                    this.newBookingColour = this.booking.cell_colour;
                })
                .catch(error => {
                    // Output our error and stop the component data loading
                    console.log(error);
                    this.booking = null;
                    this.loading = false;
                })
            },
            OnNewNameChange(event) {
                // Whenever a new name is input, update the component data field
                this.newBookingName = event.target.value;
                // If the component data field is empty or default, reset it to the current booking name value
                if (this.newBookingName == "" || this.newBookingName == "default") {
                    this.newBookingName = this.booking.booking;
                }
                // Does the submit button need toggling
                this.ToggleSubmitButton();
            },
            OnNewColourChange(event) {
                // Whenever a new colour is selected, update the component data field
                this.newBookingColour = event.target.value;
                // Does the submit button need toggling
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton() {
                // Check if either of the edittable booking variables have been amended
                let nameCheck = (this.newBookingName != "default" && this.newBookingName != this.booking.booking && this.newBookingName != "");
                let colourCheck = (this.newBookingColour != "default" && this.newBookingColour != this.booking.cell_colour && this.newBookingColour != "");
                this.disableSubmitButton = !(nameCheck || colourCheck);
            },
            SubmitBookingChanges() {
                // Create the request body to send to the endpoint
                let requestBody = {
                    id: this.booking.id,
                    name: this.newBookingName,
                    colour: this.newBookingColour
                }
                // Check the submit button isn't disabled
                if (!this.disableSubmitButton) {
                    axios.put(this.$store.getters.mimirServerAddress + "/booking_handler", requestBody)
                    .then(response => {
                        if (response.status == 202) {
                            router.push({name: "Booking View", params: { id: this.booking.id }});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            }
        },
        mounted() {
            this.GetBookingDetails();
        }
    }
</script>