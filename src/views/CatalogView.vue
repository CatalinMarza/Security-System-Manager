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
          <template v-if="editId !== i.id">
            <strong>{{ i.name }}</strong>
            <span class="badge">{{ i.type }}</span>
          </template>

          <template v-else>
            <select class="select" v-model="editForm.type">
              <option value="produs">Echipament</option>
              <option value="serviciu">Serviciu</option>
            </select>

            <input class="input" v-model.trim="editForm.name" placeholder="Denumire" />
          </template>
        </div>

        <div class="right">
          <template v-if="editId !== i.id">
            <div class="price">{{ i.price }} lei</div>
            <button class="btn" @click="startEdit(i)">Editează</button>
            <button class="btn btn-danger" @click="removeItem(i.id)">Șterge</button>
          </template>

          <template v-else>
            <input class="input" type="number" min="1" v-model.number="editForm.price" />
            <button class="btn" @click="saveEdit(i.id)">Salvează</button>
            <button class="btn" @click="cancelEdit">Anulează</button>
          </template>
        </div>
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
        <input class="input" type="number" min="1" v-model.number="form.price" placeholder="Preț" />

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

  created() {
    // log simplu pentru prezentare/debug
    console.log("CatalogView CREATED");
  },

  mounted() {
    document.title = "Catalog - Security Systems Manager";
  },

  data() {
    return {
      type: "",
      q: "",

      // formular "adaugă"
      form: { type: "", name: "", price: 0 },

      // editare inline (IMPORTANT: nu e în form!)
      editId: "",
      editForm: { type: "", name: "", price: 0 },

      error: "",
    };
  },

  computed: {
    items() {
      return this.$store.state.data.catalog;
    },
    filtered() {
      const q = (this.q || "").toLowerCase().trim();
      let arr = this.items.filter((i) => (i.name || "").toLowerCase().includes(q));
      if (this.type) arr = arr.filter((i) => i.type === this.type);
      return arr;
    },
  },

  methods: {
    addItem() {
      this.error = "";

      const type = this.form.type;
      const name = (this.form.name || "").trim();
      const price = Number(this.form.price);

      if (!type) return (this.error = "Tip obligatoriu");
      if (!name) return (this.error = "Denumire obligatorie");
      if (price <= 0) return (this.error = "Preț invalid");

      // dacă eram în editare, ieșim (ca să nu apară "Salvează" după add)
      this.cancelEdit();

      this.$store.commit("data/addCatalogItem", { type, name, price });

      this.form = { type: "", name: "", price: 0 };
    },

    startEdit(item) {
      this.editId = item.id;
      this.editForm = {
        type: item.type,
        name: item.name,
        price: Number(item.price),
      };
    },

    cancelEdit() {
      this.editId = "";
      this.editForm = { type: "", name: "", price: 0 };
    },

    saveEdit(id) {
      const type = this.editForm.type;
      const name = (this.editForm.name || "").trim();
      const price = Number(this.editForm.price);

      if (!type) return alert("Tip obligatoriu");
      if (!name) return alert("Denumire obligatorie");
      if (price <= 0) return alert("Preț invalid");

      this.$store.commit("data/updateCatalogItem", { id, type, name, price });
      this.cancelEdit();
    },

    removeItem(id) {
      if (!confirm("Ștergi acest item din catalog?")) return;

      this.$store.commit("data/deleteCatalogItem", id);

      // dacă șterg fix item-ul editat, închide editarea
      if (this.editId === id) this.cancelEdit();
    },
  },
};
</script>

<style scoped>
.toolbar { display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap; }

.list { display:flex; flex-direction:column; gap:10px; }

.item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #eee;
  padding:10px 0;
  gap:12px;
}

.left{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.right{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

.price{ font-weight:800; white-space:nowrap; }

.form{
  display:grid;
  gap:8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-top:8px;
}

.input, .select{
  border:1px solid #ddd;
  border-radius:10px;
  padding:8px 10px;
}

.btn{
  border:1px solid #ddd;
  background:#fff;
  padding:8px 10px;
  border-radius:10px;
  cursor:pointer;
}

.btn-danger{ border-color:#f2b8b5; }

.err{ color:#b00020; margin: 8px 0 0; }
</style>
