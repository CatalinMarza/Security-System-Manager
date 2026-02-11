<template>
  <section class="card">
    <header v-if="title" class="card-title">{{ title }}</header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script>
export default {
  name: "BaseCard",
  props: { title: { type: String, default: "" } },
};
</script>

<style scoped>
.card{
  border:1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow);
  overflow:hidden;
}
.card-title{
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  font-weight: 700;
}
.card-body{ padding: 14px; }
.card-footer{
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  background: #fcfcfc;
}
</style>
