<template>
    <div id="edit-timetable-component" class="container">
        <h1 class="page-title">Edit Timetable</h1>
        <div v-if="this.timetable != null" id="edit-timetable-wrapper">
            <h2>Timetable: {{ this.timetable.timetable.toUpperCase() }}</h2>
            <p>
                Rename Timetable:
                <input type="text" class="form-control w-25" placeholder="New Name" @input="OnNewNameChange($event)"/>
            </p>
            <br/>
            <button :disabled="disableSubmitButton" class="btn btn-dark" @click="SubmitTimetableChanges">Save Changes</button>
            <router-link :to="{name: 'Timetable List'}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
        <div v-else id="edit-timetable-wrapper">
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
                timetable: null,
                loading: true,
                disableSubmitButton: true,
                newTimetableName: "default"
            }
        },
        computed: {
            DefaultPageText() {
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
                    if (this.timetable == null) {
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
            },
            OnNewNameChange(event) {
                // On the entry field change check if the entry is usable
                this.newTimetableName = event.target.value;
                this.disableSubmitButton = !(this.newTimetableName != "" && this.newTimetableName != this.timetable.timetable && this.newTimetableName != "");
            },
            SubmitTimetableChanges() {
                // Request body generation
                let requestBody = {
                    id: this.timetable.id,
                    new_name: this.newTimetableName
                };
                // Check the submit button is enabled
                if (!this.disableSubmitButton) {
                    axios.put(this.$store.getters.mimirServerAddress + "/timetable_handler", requestBody)
                    .then(response => {
                        // Redirect to the View page if we were successful
                        if (response.status == 202) {
                            router.push({name: "Timetable View", params: { id: this.timetable.id }});
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
            this.GetTimetableDetails();
        }
    }
</script>
