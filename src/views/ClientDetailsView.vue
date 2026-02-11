<template>
  <BaseCard :title="client ? client.name : 'Client'">
    <div v-if="!client">Client inexistent.</div>

    <div v-else>
      <div class="tabs">
        <router-link :to="`/clients/${id}/overview`">Overview</router-link>
        <router-link :to="`/clients/${id}/offers`">Oferte</router-link>
      </div>

      <router-view :id="id" />
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";

export default {
  name: "ClientDetailsView",
  components: { BaseCard },
  props: { id: { type: String, required: true } },
  computed: {
    client() {
      return this.$store.getters["data/clientById"](this.id);
    },
  },
};
</script>

<style scoped>
.tabs { display:flex; gap:10px; margin-bottom: 12px; }
a { text-decoration:none; color:#333; padding:6px 8px; border-radius:8px; }
a.router-link-active { background:#f2f2f2; }
</style>