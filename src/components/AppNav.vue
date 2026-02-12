<template>
  <header class="nav">
    <div class="wrap">
      
            <div class="brand">
        <router-link to="/" class="title">
          Security Systems Manager
        </router-link>
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
.nav{
  background:#fff;
  border-bottom:1px solid var(--border);
}

.wrap{
  width:min(1100px, 92vw);
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 0;
}

.brand{
  display:flex;
  align-items:center;
}

/* titlu stilizat ca butoanele */
.title{
  text-decoration:none;
  font-size:18px;
  font-weight:600;
  padding:8px 10px;
  border-radius:12px;
  border:1px solid transparent;
  color:#1e40af;
}

/* hover doar pe titlu */
/*itle:hover{
  background:#f7f7f7;
  border-color:var(--border);
}*/

.links{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  color:#1e40af;
}

/* stil link-uri */
.links a{
  text-decoration:none;
  padding:8px 10px;
  border-radius:12px;
  border:1px solid transparent;
  color:inherit;
  transition: all 0.2s ease;
}

/* hover butoane */
.links a:hover{
  background:#f7f7f7;
  border-color:var(--border);
}

/* buton activ */
.links a.router-link-active{
  border-color: var(--border);
  background:#f7f7f7;
}
</style>

