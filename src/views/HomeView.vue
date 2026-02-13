<template>
  <BaseCard title="Dashboard">

    <div class="grid">

      <div class="stat">
        <div class="label">Total clienți</div>
        <div class="value">{{ clientsCount }}</div>
      </div>

      <div class="stat">
        <div class="label">Total produse și servicii în catalog</div>
        <div class="value">{{ catalogCount }}</div>
      </div>

      <div class="stat clock">
         <div class="label">Ora sistemului</div>
         <div class="value">{{ time }}</div>
        <div class="small">{{ date }}</div>
      </div>

      <div class="stat">
        <div class="label">Total oferte create</div>
         <div class="value">{{ offersCount }}</div>
      </div>
    </div>

  </BaseCard>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";

export default {
  name: "HomeView",
  components: { BaseCard },

  data(){
    return{
      time:"",
      date:"",
      timer: null
    };
  },

  computed:{
    clientsCount(){
      return this.$store.state.data.clients.length;
    },
    catalogCount(){
      return this.$store.state.data.catalog.length;
    },
    offersCount(){
      return this.$store.state.data.offers.length;
    }
  },

  mounted(){
    console.log("HomeView montat – timer pornit");
    this.updateClock();
    this.timer = setInterval(() => {
      this.updateClock();
    }, 1000);

  },
  methods:{
    updateClock(){
      const now = new Date();
      this.time = now.toLocaleTimeString();
      this.date = now.toLocaleDateString();
    }
  },
  
    beforeUnmount() { 
      console.log("HomeView demontat – timer oprit");
      clearInterval(this.timer);
  },
};

</script>

<style scoped>
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:16px;
}

.stat{
  border:1px solid #e5e7eb;
  border-radius:16px;
  padding:18px;
  background:#fff;
}

.label{
  font-size:14px;
  color:#6b7280;
}

.value{
  font-size:36px;
  font-weight:800;
  color:#1e40af;
  margin:6px 0;
}

.small{
  font-size:13px;
  color:#6b7280;
}
</style>
