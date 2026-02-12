<template>
  <BaseCard title="Catalog echipamente / servicii">
    <div class="toolbar">
      <select class="select" v-model="type">
        <option value="">Toate</option>
        <option value="produs">Echipamente</option>
        <option value="serviciu">Servicii</option>
      </select>

      <input class="input" v-model="q" placeholder="Caută..." />
    </div>

    <div v-if="filtered.length === 0">Catalog gol.</div>

    <div class="list" v-else>
      <div class="item" v-for="i in filtered" :key="i.id">
        <div class="left">
          <strong class="name">{{ i.name }}</strong>
          <div class="meta">
            <span class="badge">{{ i.type }}</span>
          </div>
        </div>
        <div class="price">{{ i.price }} lei</div>
      </div>
    </div>

    <template #footer>
      <strong>Adaugă echipament / serviciu</strong>

      <div class="form">
        <select class="select" v-model="form.type">
          <option disabled value="">Tip</option>
          <option value="produs">Echipament</option>
          <option value="serviciu">Serviciu</option>
        </select>

        <input class="input" v-model.trim="form.name" placeholder="Denumire" />
        <input class="input" type="number" min="0" v-model.number="form.price" placeholder="Preț" />

        <button class="btn" @click="addItem">Adaugă</button>
      </div>

      <p v-if="error" class="err">{{ error }}</p>
    </template>
  </BaseCard>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";

export default {
  name: "CatalogView",
  components: { BaseCard },

 //Simulare încărcare date chiar dacă datele sunt locale.
  created() {
  console.log("Catalog încărcat");
  },

  data() {
    return {
      type: "",
      q: "",
      form: {
        type: "",
        name: "",
        price: 0,
      },
      error: "",
    };
  },
  computed: {
    items() {
      return this.$store.state.data.catalog;
    },
    filtered() {
      const q = this.q.toLowerCase().trim();
      let arr = this.items.filter((i) => i.name.toLowerCase().includes(q));
      if (this.type) arr = arr.filter((i) => i.type === this.type);
      return arr;
    },
  },
  methods: {
    addItem() {
      this.error = "";

      if (!this.form.type) return (this.error = "Tip obligatoriu");
      if (!this.form.name) return (this.error = "Denumire obligatorie");
      if (Number(this.form.price) <= 0) return (this.error = "Preț invalid");

      this.$store.commit("data/addCatalogItem", {
        type: this.form.type,
        name: this.form.name,
        price: Number(this.form.price),
      });

      this.form = { type: "", name: "", price: 0 };
    },
  },
};
</script>

<style scoped>
.toolbar { display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap; }

.list { display:flex; flex-direction:column; gap:10px; }
.item {
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #eee;
  padding:10px 0;
  gap:12px;
}
.left { display:flex; flex-direction:column; gap:6px; }
.name { display:block; }
.meta { display:flex; gap:6px; flex-wrap:wrap; }
.price { font-weight:800; white-space:nowrap; }

.form{
  display:grid;
  gap:8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-top:8px;
}

.err { color:#b00020; margin: 8px 0 0; }
</style>
