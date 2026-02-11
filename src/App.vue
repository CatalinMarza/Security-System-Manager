<template>
  <div class="app">
    <AppNav />
    <main class="page">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppNav from "./components/AppNav.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: { AppNav, AppFooter },
  created() {
    this.$store.commit("data/seedIfEmpty")
  },
};
</script>

<style>
.app { min-height: 100vh; display: flex; flex-direction: column; background: #fafafa; }
.page { width: min(1100px, 92vw); margin: 18px auto; flex: 1; }
</style>
