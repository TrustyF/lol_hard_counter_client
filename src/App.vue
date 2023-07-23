<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
</script>

<template>
<!--  <nav>-->
<!--    <RouterLink to="/">Home</RouterLink>-->
<!--  </nav>-->
  <NavBar></NavBar>
  <RouterView />
</template>

<style scoped>
</style>
