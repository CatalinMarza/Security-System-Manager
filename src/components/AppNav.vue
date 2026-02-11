<template>
  <header class="nav">
  <div class="wrap">
    <div class="brand">
      <div class="logo">SS</div>
      <div>
        <div class="title">Security Systems Manager</div>
        <div class="sub">Vue + Router + Vuex</div>
      </div>
    </div>

    <nav class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/clients">Clienți</router-link>
      <router-link to="/catalog">Catalog</router-link>
      <router-link to="/offers/new">Ofertă nouă</router-link>
    </nav>
  </div>
</header>
</template>

<script>
export default { name: "AppNav" };
</script>

<style scoped>
.nav{ background:#fff; border-bottom:1px solid var(--border); }
.wrap{
  width:min(1100px, 92vw);
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:14px;
  padding:12px 0;
}
.brand{ display:flex; align-items:center; gap:10px; }
.logo{
  width:34px; height:34px; border-radius:12px;
  display:grid; place-items:center;
  border:1px solid var(--border);
  font-weight:800;
}
.title{ font-weight:800; line-height:1.1; }
.sub{ font-size:12px; color:var(--muted); }

.links{ display:flex; gap:10px; flex-wrap:wrap; }
a{
  text-decoration:none;
  padding:8px 10px;
  border-radius:12px;
  border:1px solid transparent;
}
a.router-link-active{
  border-color: var(--border);
  background:#f7f7f7;
}
</style>