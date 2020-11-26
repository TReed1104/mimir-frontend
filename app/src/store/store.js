import Vue from 'vue'
import Vuex from 'vuex'
import Timetable from '../classes/Timetable.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        mimirAddress: "http://127.0.0.1/mimir-api",
        currentTimetable: new Timetable("")
    },
    getters: {
        // Endpoints
        mimirServerAddress: state => state.mimirAddress,
        mimirEndpointTimetables: state => { return state.mimirAddress + "/timetables"},
        mimirEndpointBookings: state => { return state.mimirAddress + "/bookings?timetable="},
    },
    mutations: {
    },
    actions: {
    }
})