<template>
    <div class="timetable-column">
        <div class="timetable-row black-border-bottom timetable-colour-grey">
            <div class="cell cell-height-40px">
                {{columnTitle}}
            </div>
        </div>
        <Booking v-for="(booking, booking_index) in timetable.timetableGrid[index]" :timetable="timetable" :booking="booking" :key="booking_index"></Booking>
    </div>
</template>

<script>
    import Booking from './Booking.vue'
    import moment from 'moment'
    export default {
        props: {
            timetable: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        components: {
            Booking
        },
        computed: {
            columnTitle() {
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
                        return "";
                    }
                    week = moment(chosenWeekToRender, 'YYYY-MM-DD');
                }
                let date = week.startOf('isoWeek').add(this.index, 'days');
                let columnTitle = date.format('dddd') + " " + date.format('DD/MM')
                return columnTitle;
            }
        }
    }
</script>