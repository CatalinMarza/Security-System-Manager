<template>
  <div class="row">
    <div class="main">
      <div class="name">{{ client.name }}</div>
      <div class="meta">{{ client.type }} · {{ client.email || "-" }}</div>
    </div>
    
    <div class="actions">
      <button @click="$emit('open', client.id)">Detalii</button>
      <button class="danger" @click="$emit('remove', client.id)">Șterge</button>
    </div>

   
  </div>
</template>

<script>
export default {
  name: "ClientRow",
  props: { client: { type: Object, required: true } },
  emits: ["open", "remove"],
};
</script>

<style scoped>
.row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid #eee; }
.name { font-weight: 700; }
.meta { font-size: 13px; color: #666; }
.actions { display:flex; gap:8px; }
button { border: 1px solid #ddd; background:#fff; padding:6px 10px; border-radius:10px; cursor:pointer; }
button.danger { border-color:#f0caca; }
</style>