<template>
    <div id="create-booking-component" class="container">
        <h1 class="page-title">Create New Booking</h1>
        <div id="create-booking-wrapper">
            <div id="timetable-select-wrapper">
                <h2 class="page-title">Choose A Timetable</h2>
                <select v-if="this.timetables.length == 0" id="timetable-input" class="form-control w-25">
                    <option :id="'timetable-option-default'" value="timetable_option_default">Loading Timetables...</option>
                </select>
                <select v-else-if="this.timetables.length > 0" id="timetable-input" class="form-control w-25" @change="OnTimetableSelectionChange($event)">
                    <option :id="'timetable-option-default'" value="timetable_option_default">No Timetable Selected</option>
                    <option v-for="timetable in this.timetables" :key="timetable.id" :id="'timetable_option_' + timetable.id" :value="timetable.timetable">{{ timetable.timetable.toUpperCase() }}</option>
                </select>
            </div>
            <div v-if="this.showBookingDetailInputs" id="booking-details-form">
                <h2 class="page-title">Booking Details</h2>
                <p>
                    Enter the booking name:
                    <input id="booking-name-input" type="text" class="form-control w-25" v-model="newBookingName" placeholder="Booking Name" @input="ToggleSubmitButton()"/>
                    <br/>
                    Choose A Date For The Booking:
                    <input id="booking-date-input" type="date" class="form-control w-25" v-model="newBookingDate" @input="ToggleSubmitButton()" required/>
                    <br/>
                    Choose A Start Time:
                    <input id="booking-start-input" type="time" class="form-control w-25" v-model="newBookingStart" @input="ToggleSubmitButton()" min="09:00" max="18:00" step="900" required/>
                    <br/>
                    Choose A End Time:
                    <input id="booking-end-input" type="time" class="form-control w-25" v-model="newBookingEnd" @input="ToggleSubmitButton()" min="09:00" max="18:00" step="900" required/>
                    <br/>
                    Change Booking Colour:
                    <input type="color" class="form-control w-25" v-model="newBookingColour" @input="ToggleSubmitButton()"/>
                    <br/>
                </p>
            </div>
            <br/>
            <button :disabled="disableSubmitButton" id="submit-button" class="btn btn-dark" @click="SubmitBookingDetails">Create Booking</button>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Back To Timetable List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    import moment from 'moment'
    export default {
        data() {
            return {
                loading: true,
                disableSubmitButton: true,
                timetables: [],
                showBookingDetailInputs: false,
                selectedTimetable: null,
                newBookingName: '',
                newBookingDate: moment().format("YYYY-MM-DD"),
                newBookingStart: moment().format("09:00", "HH:mm"),
                newBookingEnd: moment().format("10:00", "HH:mm"),
                newBookingColour: "#FFFFFF"
            }
        },
        computed: {
        },
        methods: {
            GetTimetableList() {
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
            },
            OnTimetableSelectionChange(event) {
                // If the selected timetable is not the default
                if (event.target.value != "timetable_option_default") {
                    // Show the input form
                    this.showBookingDetailInputs = true;
                    // If the selection is a different timetable, reset the form
                    if (this.selectedTimetable != event.target.value) {
                        this.selectedTimetable = event.target.value;
                        this.ResetFormStates(false);
                    }
                }
                else {
                    // Fully reset the form as the default option has been selected
                    this.ResetFormStates(true);
                }
            },
            ResetFormStates(fullReset) {
                // If fullreset is true, hide the form and fully reset everything
                if (fullReset) {
                    this.showBookingDetailInputs = false;
                }
                // Reset the form data states
                this.newBookingName = '';
                this.newBookingDate = moment().format("YYYY-MM-DD");
                this.newBookingStart = moment().format("09:00", "HH:mm");
                this.newBookingEnd = moment().format("10:00", "HH:mm");
                this.newBookingColour = "#FFFFFF";
                // Toggle the submitButton
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton() {
                // Our state checks, if all are true the button will be enabled
                let isNameValid = (this.newBookingName != "" && this.newBookingName != "default");
                let isTimeSpanValid = (this.newBookingStart < this.newBookingEnd);                  // TODO: Make sure the minutes are of a 15 minute interval
                let isColourValid = (/^#[0-9A-F]{6}$/i.test(this.newBookingColour));

                // Set the button toggle state as a sum conditional of the other checks (inverted because the toggle is isDisabled, not isEnabled)
                this.disableSubmitButton = !(isNameValid && isTimeSpanValid && isColourValid);
            },
            SubmitBookingDetails() {
                // Check the booking details input is shown and the submit button is enabled
                if (this.showBookingDetailInputs && !this.disableSubmitButton) {
                    // Format the start and end time to be valid for the API endpoint
                    let formattedStartTime = this.newBookingDate + "T" + this.newBookingStart + ":00+00:00";
                    let formattedEndTime = this.newBookingDate + "T" + this.newBookingEnd + ":00+00:00";

                    // Create our request body
                    let requestBody = {
                        "timetable": this.selectedTimetable,
                        "name": this.newBookingName,
                        "start": formattedStartTime,
                        "end": formattedEndTime,
                        "colour": this.newBookingColour
                    };

                    // Send POST Request
                    axios.post(this.$store.getters.mimirServerAddress + "/booking_handler", requestBody)
                    .then(response => {
                        // Redirect to the View page if we were successful
                        if (response.status == 201) {
                            let timetableID = this.timetables.find(timetable => timetable.timetable == this.selectedTimetable).id;
                            router.push({name: "Booking List", params: { timetable: timetableID }});
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
            this.GetTimetableList();
        }
    }
</script>