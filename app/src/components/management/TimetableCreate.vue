<template>
    <div id="create-timetable-component" class="container">
        <h1 class="page-title">Create New Timetable</h1>
        <div id="create-timetable-wrapper">
            <p>
                Timetable Name:
                <input type="text" class="form-control w-25" placeholder="Timetable Name" @input="OnNameEntry($event)"/>
            </p>
            <button :disabled="disableSubmitButton" class="btn btn-dark" @click="SubmitTimetableDetails">Create Timetable</button>
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
                newTimetableName: "default",
                disableSubmitButton: true
            }
        },
        computed: {
        },
        methods: {
            OnNameEntry(event) {
                // Store the value on the component and see if the submit button needs toggling
                this.newTimetableName = event.target.value;
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton() {
                // Check the components timetable name data field has been editted and isn't blank
                if (this.newTimetableName != "" && this.newTimetableName != "default") {
                    // Enable the submit button
                    this.disableSubmitButton = false;
                }
                else {
                    // Disable the submit button
                    this.disableSubmitButton = true;
                }
            },
            SubmitTimetableDetails() {
                // Request body generation
                let requestBody = {
                    name: this.newTimetableName
                };
                // Check the submit button is enabled
                if (!this.disableSubmitButton) {
                    axios.post(this.$store.getters.mimirServerAddress + "/timetable_handler", requestBody)
                    .then(response => {
                        // Redirect to the View page if we were successful
                        if (response.status == 201) {
                            router.push({name: "Timetable List"});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            }
        }
    }
</script>