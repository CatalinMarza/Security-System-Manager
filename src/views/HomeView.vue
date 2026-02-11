<template>
  <div class="grid">
    <BaseCard title="Clienți">
      <div style="font-size:34px;font-weight:800">{{ clientsCount }}</div>
      <span class="badge">persistență localStorage</span>
    </BaseCard>

    <BaseCard title="Catalog">
      <div style="font-size:34px;font-weight:800">{{ catalogCount }}</div>
      <span class="badge">produse + servicii</span>
    </BaseCard>

    <BaseCard title="Routing">
      <div style="font-size:34px;font-weight:800">OK</div>
      <span class="badge">dinamic + nested</span>
    </BaseCard>
  </div>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";

export default {
  name: "HomeView",
  components: { BaseCard },
  computed: {
    clientsCount() {
      return this.$store.state.data.clients.length;
    },
    catalogCount() {
      return this.$store.state.data.catalog.length;
    },
  },
};
</script>
