<template>
    <div id="page-content" class="container-fluid">
        <h1 class="page-title">Timetable for {{ this.title.toUpperCase()}}</h1>
        <br/>
        <TimetableGrid :key="this.timetable.name" :timetable="this.timetable"></TimetableGrid>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    import Booking from '../../classes/Booking.js'
    import Timetable from '../../classes/Timetable.js'
    import { setInterval, clearInterval } from 'timers';
    import TimetableGrid from './TimetableGrid.vue'
    export default {
        components: {
            TimetableGrid
        },
        data() {
            return {
                timetable: new Timetable("blank"),
                title: '',
                bookings: [],
                updateTimer: ''
            }
        },
        methods: {
            GetTimetableBookings() {
                // Get the timetable ID from the url route
                let timetableID = 'inb1102'
                if (Object.keys(this.$route.params).length != 0) {
                    timetableID = this.$route.params.timetable;
                }
                this.title = timetableID;
                // Get the timetable data from the Mimir-API
                axios.get(this.$store.getters.mimirEndpointBookings + timetableID)
                    .then(response => {
                        if (this.bookings != response.data.data.bookings){
                            this.timetable = new Timetable(timetableID);
                        }
                        this.bookings = response.data.data.bookings;
                        this.UpdateTimetable();
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            UpdateTimetable(){
                // Get the timetable ID from the url route
                let chosenWeekToRender = 'today'
                if (this.$route.params.date != undefined) {
                    chosenWeekToRender = this.$route.params.date;
                }

                // Calculate the week to render
                let week = moment();
                if (chosenWeekToRender != 'today') {
                    // Parse the router param and work out what week to use
                    const regExp = /^\d{4}-(0?[1-9]|1[0-2])-0?([0-9]|[12][0-9]|3[01])$/gm;    // Valid: YYYY-MM-DD, YYYY-M-D
                    let valid = regExp.test(chosenWeekToRender);
                    if (!valid) {
                        window.alert("Invalid supplied Date in URL, please use the format: YYYY-MM-DD");
                        return;
                    }
                    week = moment(chosenWeekToRender, 'YYYY-MM-DD');
                }
                // Our date bounds for checking if the session is in the week to be rendered
                let startOfWeek = week.startOf('isoWeek').toDate();
                let endOfWeek = week.endOf('isoWeek').toDate();

                // Iterate through the Mimir API response
                this.bookings.forEach(function(booking) {
                    // Create a booking object from the booking
                    let currentBooking = new Booking("", booking.booking, booking.timetable, booking.start_time, booking.end_time, booking.duration, booking.cell_colour);

                    // Check if the current booking object is between the start and end of the week to render
                    if (!currentBooking.startTime.isBetween(startOfWeek, endOfWeek)) {
                        // Not between the start and end of the desired week
                        return;
                    }

                    // Calculate how many slots in the timetable grid to fill
                    let numberOfSlots = (booking.duration * this.timetable.sectionsPerHour);
                    let sectionTimeInMinutes = (this.timetable.lengthOfHour / this.timetable.sectionsPerHour);
                    for (let i = 0; i < numberOfSlots; i++) {
                        // Generate the slotID for the booking
                        let time = moment(currentBooking.startTime, 'HH:mm').add(i * sectionTimeInMinutes, 'minutes').format('HH:mm');
                        let slotID = currentBooking.startTime.format('ddd') + " " + time;

                        // Set the booking slot to the new booking
                        currentBooking.slotID = slotID;
                        this.timetable.SetSlot(slotID, currentBooking);
                    }
                }, this);
            }
        },
        mounted() {
            this.GetTimetableBookings();
            this.updateTimer = setInterval(this.GetTimetableBookings, 30000);
        },
        beforeDestroy() {
            clearInterval(this.updateTimer);
        }
    }
</script>