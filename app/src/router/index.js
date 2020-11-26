import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import TimetableApp from '../components/timetable/TimetableApp.vue'
import TimetablesList from '../components/management/TimetablesList.vue'
import TimetableCreate from '../components/management/TimetableCreate.vue'
import TimetableView from '../components/management/TimetableView.vue'
import TimetableEdit from '../components/management/TimetableEdit.vue'
import BookingsList from '../components/management/BookingsList.vue'
import BookingCreate from '../components/management/BookingCreate.vue'
import BookingView from '../components/management/BookingView.vue'
import BookingEdit from '../components/management/BookingEdit.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/app/:timetable/:date?',
            name: 'timetable',
            component: TimetableApp
        },
        {
            path: '/admin/timetables',
            name: 'Timetable List',
            component: TimetablesList
        },
        {
            path: '/admin/timetable/:timetable/bookings',
            name: 'Booking List',
            component: BookingsList
        },
        {
            path: '/admin/timetable/:id?',
            name: 'Timetable View',
            component: TimetableView
        },
        {
            path: '/admin/booking/:id?',
            name: 'Booking View',
            component: BookingView
        },
        {
            path: '/admin/create/timetable',
            name: 'Timetable Create',
            component: TimetableCreate
        },
        {
            path: '/admin/create/booking',
            name: 'Booking Create',
            component: BookingCreate
        },
        {
            path: '/admin/edit/timetable/:id?',
            name: 'Timetable Edit',
            component: TimetableEdit
        },
        {
            path: '/admin/edit/booking/:id?',
            name: 'Booking Edit',
            component: BookingEdit
        }
    ]
})