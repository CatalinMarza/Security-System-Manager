<template>
  <header class="nav">
    <div class="wrap">
           
      <nav class="links">
        <router-link to="/">Home</router-link>
        <router-link to="/clients">Clienți</router-link>
        <router-link to="/catalog">Catalog</router-link>
        <router-link to="/offers/new">Ofertă nouă</router-link>
      </nav>

      <div class="brand">
        <router-link to="/" class="title">
          Security Systems Manager
        </router-link>
      </div>

      <div class="user">
        <img :src="userAvatar" class="avatar" />

        <div class="userMeta">
          <span class="name">{{ userName }}</span>
          <span class="role">{{ userRole }}</span>
        </div>
      </div>
     </div>
  </header>
</template>

<script>
export default { name: "AppNav", 
  computed: {
    userName() { return this.$store.state.user.name; },
    userRole() { return this.$store.state.user.role; },
    userAvatar() { return this.$store.state.user.avatar; },
    },
};

</script>

<style scoped>
.nav{
  background:#fff;
  border-bottom:1px solid var(--border);
}

.wrap{
  position:relative;
  width:min(1100px, 92vw);
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 0;
}


.brand{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
}


.title{
  text-decoration:none;
  font-size:18px;
  font-weight:600;
  padding:8px 10px;
  border-radius:12px;
  border:1px solid transparent;
  color:#1e40af;
}

.links{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  color:#1e40af;
}

.links a{
  text-decoration:none;
  padding:8px 10px;
  border-radius:12px;
  border:1px solid transparent;
  color:inherit;
  transition: all 0.2s ease;
}

.links a:hover{
  background:#f7f7f7;
  border-color:var(--border);
}

.links a.router-link-active{
  border-color: var(--border);
  background:#f7f7f7;
}

/* ✅ USER BOX (pe desktop + mobile) */
.user{
  display:flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border-radius:12px;
  border:1px solid var(--border);
  background:#f8fafc;
  font-size:14px;
  white-space:nowrap;
}

.avatar{
  width:32px;
  height:32px;
  border-radius:50%;
  object-fit:cover;
}

.user .name{
  color:#1e40af;
  font-weight:600;
}

.userMeta{
  display:flex;
  flex-direction:column;
  line-height:1.1;
}

.user .role{
  background:#1e40af;
  color:#fff;
  padding:2px 8px;
  border-radius:10px;
  font-size:12px;
}

/* ✅ mobile */
@media (max-width: 640px){
  .wrap{
    flex-direction:column;
    align-items:flex-start;
    gap:10px;
  }
  .links{
    width:100%;
  }
  .links a{
    width:100%;
  }
}

</style>

