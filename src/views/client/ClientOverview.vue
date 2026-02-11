<template>
  <div v-if="client">
    <p><strong>Tip:</strong> {{ client.type }}</p>
    <p><strong>Email:</strong> {{ client.email || "-" }}</p>
    <p v-if="client.type==='PF'"><strong>CNP:</strong> {{ client.cnp }}</p>
    <p v-else><strong>CUI:</strong> {{ client.cui }}</p>
  </div>
</template>

<script>
export default {
  name: "ClientOverview",
  props: { id: { type: String, required: true } },
  computed: {
    client() {
      return this.$store.getters["data/clientById"](this.id);
    },
  },
};
</script>
