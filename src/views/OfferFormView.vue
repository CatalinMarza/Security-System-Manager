<template>
  <BaseCard title="Ofertă nouă (sisteme de securitate)">
    <div class="grid2">
      <div class="field">
        <label>Client</label>
        <select class="select" v-model="clientId">
          <option disabled value="">Alege client</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Status</label>
        <select class="select" v-model="status">
          <option>Draft</option>
          <option>Trimis</option>
          <option>Acceptat</option>
        </select>
      </div>
    </div>

    <hr style="margin:16px 0;" />

    <strong>Adaugă linie din catalog</strong>
    <div class="lineAdd">
      <select class="select" v-model="newItemId">
        <option disabled value="">Echipament/Serviciu</option>
        <option v-for="i in catalog" :key="i.id" :value="i.id">
          {{ i.name }} ({{ i.type }}) - {{ i.price }} lei
        </option>
      </select>

      <input class="input" type="number" min="1" v-model.number="newQty" />
      <button class="btn" @click="addLine">Adaugă</button>
    </div>

    <div v-if="lines.length" style="margin-top:12px;">
      <div class="line" v-for="(l, idx) in lines" :key="idx">
        <div>
          <strong>{{ itemName(l.itemId) }}</strong>
          <div class="meta">
            <span class="badge">{{ itemType(l.itemId) }}</span>
            <span class="badge">qty: {{ l.qty }}</span>
            <span class="badge">{{ l.price }} lei</span>
          </div>
        </div>
        <button class="btn btn-danger" @click="removeLine(idx)">Șterge</button>
      </div>
    </div>

    <div class="total">
      Total: {{ total }} lei
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div style="margin-top:12px;">
      <button class="btn" @click="save">Salvează oferta</button>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";

export default {
  name: "OfferFormView",
  components: { BaseCard },
  data() {
    return {
      clientId: this.$route.query.clientId || "",
      status: "Draft",
      newItemId: "",
      newQty: 1,
      lines: [],
      error: "",
    };
  },
  computed: {
    clients() {
      return this.$store.state.data.clients;
    },
    catalog() {
      return this.$store.state.data.catalog;
    },
    total() {
      return this.lines.reduce((s, l) => s + Number(l.qty) * Number(l.price), 0);
    },
  },
  mounted() {
    document.title = "Ofertă nouă - Security Systems Manager";
  },
  methods: {
    itemById(id) {
      return this.$store.state.data.catalog.find((x) => x.id === id);
    },
    itemName(id) {
      return this.itemById(id)?.name || "Item";
    },
    itemType(id) {
      return this.itemById(id)?.type || "-";
    },
    addLine() {
      this.error = "";
      if (!this.newItemId) return (this.error = "Alege un echipament/serviciu.");
      if (Number(this.newQty) <= 0) return (this.error = "Cantitate > 0.");

      const item = this.itemById(this.newItemId);
      this.lines.push({
        itemId: item.id,
        qty: Number(this.newQty),
        price: Number(item.price),
      });

      this.newItemId = "";
      this.newQty = 1;
    },
    removeLine(idx) {
      this.lines.splice(idx, 1);
    },
    save() {
      this.error = "";
      if (!this.clientId) return (this.error = "Client obligatoriu.");
      if (this.lines.length === 0) return (this.error = "Adaugă minim o linie în ofertă.");

      this.$store.commit("data/addOffer", {
        clientId: this.clientId,
        date: new Date().toISOString().slice(0, 10),
        status: this.status,
        lines: this.lines,
         total: this.total,
      });
      
      
      // navigăm la tab-ul nested: /clients/:id/offers
      this.$router.push(`/clients/${this.clientId}/offers`);
    },
  },
};
</script>

<style scoped>
.grid2{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap:12px;
}

.field{
  display:flex;
  flex-direction:column;
  gap:6px;
}

.lineAdd{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:center;
  margin-top:8px;
}

.line{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 0;
  border-bottom:1px solid #eee;
  gap:12px;
}

.meta{
  display:flex;
  gap:6px;
  margin-top:6px;
  flex-wrap:wrap;
}

.total{
  margin-top:12px;
  font-weight:800;
}

.err{
  color:#b00020;
  margin-top:8px;
}
</style>
