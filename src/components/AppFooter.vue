<template>
  <footer class="foot">
    <div class="container">
      <small>© {{ year }} Service Manager</small>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.foot { border-top: 1px solid #eee; padding: 12px 0; background: #fff; margin-top: 18px; }
.container { width: min(1100px, 92vw); margin: 0 auto; }
</style>
