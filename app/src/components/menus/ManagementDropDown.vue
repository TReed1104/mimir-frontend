<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Management
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" class="dropdown-item" :to="{name: 'Timetable Create'}">Create Timetable</router-link>
            <router-link tag="a" class="dropdown-item" :to="{name: 'Booking Create'}">Create Booking</router-link>
            <router-link tag="a" class="dropdown-item" :to="{name: 'Timetable List'}">Timetables</router-link>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>