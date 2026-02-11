<template>
  <BaseCard title="Clienți (sisteme de securitate)">
    <div class="toolbar">
      <input v-model="q" placeholder="Caută după nume..." />
      <select v-model="sortBy">
        <option value="name_asc">Nume A-Z</option>
        <option value="name_desc">Nume Z-A</option>
        <option value="newest">Cei mai noi</option>
      </select>
      <button @click="importDemo">Import demo (async)</button>
    </div>

    <ClientList :clients="filteredClients" @open="openClient" @remove="removeClient" />

    <template #footer>
      <div class="footer-form">
        <strong>Adaugă client</strong>

        <div class="form">
          <select v-model="form.type">
            <option disabled value="">Tip</option>
            <option>PF</option>
            <option>PFA</option>
            <option>PJ</option>
          </select>

          <input v-model.trim="form.name" placeholder="Nume / Denumire" />
          <input v-model.trim="form.email" placeholder="Email (opțional)" />

          <input v-if="form.type==='PF'" v-model.trim="form.cnp" placeholder="CNP (13 cifre)" />
          <input v-else v-model.trim="form.cui" placeholder="CUI (ex: RO123...)" />

          <button @click="addClient">Adaugă</button>
        </div>

        <p v-if="error" class="err">{{ error }}</p>
      </div>
    </template>
  </BaseCard>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";
import ClientList from "../components/ClientList.vue";

export default {
  name: "ClientsView",
  components: { BaseCard, ClientList },
  data() {
    return {
      q: "",
      sortBy: "name_asc",
      form: { type: "", name: "", email: "", cnp: "", cui: "" },
      error: "",
    };
  },
  computed: {
    clients() {
      return this.$store.state.data.clients;
    },
    filteredClients() {
      const q = this.q.toLowerCase().trim();
      let arr = this.clients.filter((c) => c.name.toLowerCase().includes(q));

      if (this.sortBy === "name_asc") arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
      if (this.sortBy === "name_desc") arr = [...arr].sort((a, b) => b.name.localeCompare(a.name));
      if (this.sortBy === "newest") arr = [...arr].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      return arr;
    },
  },

  mounted() {
  // inițializare dependentă de DOM (exemplu simplu)
    document.title = "Clienți - Security Systems Manager";
  },

  
  methods: {
    openClient(id) {
    this.$router.push(`/clients/${id}`);
    },
    removeClient(id) {
      this.$store.commit("data/deleteClient", id);
    },
    validate() {
      this.error = "";
      if (!this.form.type) return (this.error = "Tip client obligatoriu.");
      if (!this.form.name) return (this.error = "Nume/Denumire obligatoriu.");

      if (this.form.type === "PF") {
        if (!/^\d{13}$/.test(this.form.cnp)) return (this.error = "CNP trebuie să aibă 13 cifre.");
      } else {
        if (!this.form.cui) return (this.error = "CUI obligatoriu pentru PFA/PJ.");
      }
      return true;
    },
    addClient() {
      if (!this.validate()) return;
      this.$store.commit("data/addClient", { ...this.form });
      this.form = { type: "", name: "", email: "", cnp: "", cui: "" };
    },
    async importDemo() {
      await this.$store.dispatch("data/importDemoClientsAsync");
    },
  },
};
</script>

<style scoped>
.toolbar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom: 12px; }
input, select { border:1px solid #ddd; border-radius:10px; padding:8px 10px; }
button { border:1px solid #ddd; background:#fff; padding:8px 10px; border-radius:10px; cursor:pointer; }
.footer-form { display:flex; flex-direction:column; gap:10px; }
.form { display:grid; gap:8px; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); }
.err { color:#b00020; margin: 0; }
</style>
