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
    userName() { 
      return this.$store.state.user.name;
    },
    userRole(){ 
      return this.$store.state.user.role; 
    },
    userAvatar() { 
      return this.$store.state.user.avatar; 
    },
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
  font-weight:600;
  color:#1e40af;
  font-size: clamp(14px, 1.6vw, 18px);
  padding: clamp(4px, 0.8vw, 8px) clamp(6px, 1.0vw, 10px);
  border-radius:12px;
  border:1px solid transparent;
  white-space: nowrap;
}



.links{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  color:#1e40af;
}

.links a{
  text-decoration:none;
  color:inherit;
  border:1px solid transparent;
  border-radius:12px;
  transition: all 0.2s ease;

  font-size: clamp(13px, 1.2vw, 16px);
  padding: clamp(5px, 0.7vw, 8px) clamp(7px, 0.9vw, 10px);
  white-space: nowrap;
}

.links a:hover{
  background:#f7f7f7;
  border-color:var(--border);
}

.links a.router-link-active{
  border-color: var(--border);
  background:#f7f7f7;
}

/*USER BOX (pe desktop + mobile) */
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

/*mobile */
/* când nu mai încape pe un singur rând -> titlu + user SUS, meniul JOS */
@media (max-width: 980px){
  .wrap{
    position: static;
    display:grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "brand user"
      "links links";
    gap:10px;
    align-items:center;
  }

  .brand{
    grid-area:brand;
    position:static;
    left:auto;
    transform:none;
    justify-self:start;
  }

  .user{
    grid-area:user;
    justify-self:end;
  }

  .links{
    grid-area:links;
    width:100%;
  }

  /* pe îngust, poți lăsa butoanele să curgă frumos */
  .links{
    flex-wrap:wrap;
  }
}




</style>

