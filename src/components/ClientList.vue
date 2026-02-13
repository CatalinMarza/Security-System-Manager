<template>
  <div>
    <ClientRow
      v-for="c in clients"
      :key="c.id"
      :client="c"
      @open="$emit('open', $event)"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
    />
    <p v-if="clients.length === 0" class="empty">Nu există clienți.</p>
  </div>
</template>

<script>
import ClientRow from "./ClientRow.vue";

export default {
  name: "ClientList",
  components: { ClientRow },
  props: { clients: { type: Array, required: true } },
  emits: ["open", "edit", "remove"],
};
</script>

<style scoped>
.empty { color:#666; font-size:14px; padding:10px 0; }
</style>
