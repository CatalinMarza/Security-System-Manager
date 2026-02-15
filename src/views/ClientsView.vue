<template>
  <BaseCard title="Clienți (sisteme de securitate)">
      <div class="toolbar">
        <input v-model.trim="q" placeholder="Caută după nume..." />
        <select v-model="sortBy">
          <option value="name_asc">Nume A-Z</option>
          <option value="name_desc">Nume Z-A</option>
          <option value="newest">Cei mai noi</option>
        </select>
        <button @click="importDemo">Import demo (async)</button>
      </div>

      <ClientList
        :clients="filteredClients"
        @open="openClient"
        @edit="startEdit"
        @remove="removeClient"
      />


      <div v-if="editId" class="editBox">
        <strong>Editează client</strong>

        <div class="form">
          <select v-model="editForm.type">
            <option>PF</option>
            <option>PFA</option>
            <option>PJ</option>
          </select>
          <input v-model.trim="editForm.name" placeholder="Nume / Denumire" />
          <input v-model.trim="editForm.email" placeholder="Email" />
          <input v-if="editForm.type==='PF'" v-model.trim="editForm.cnp" placeholder="CNP (13 cifre)" />
          <input v-else v-model.trim="editForm.cui" placeholder="CUI" />
          <button @click="saveEdit(editId)">Salvează</button>
          <button @click="cancelEdit">Anulează</button>
        </div>
      </div>

    <template #footer>
      <div class="footer-form">
        <strong>Adaugă client</strong>

          <div class="form">
            <select v-model="form.type">
              <option disabled value="">Tip</option>
              <option value="PF">PF</option>
              <option value="PFA">PFA</option>
              <option value="PJ">PJ</option>
            </select>

            <input v-model.trim="form.name" placeholder="Nume / Denumire" />
            <input v-model.trim="form.email" placeholder="Email (opțional)" />

            <input
              v-if="form.type === 'PF'"
              v-model.trim="form.cnp"
              placeholder="CNP (13 cifre)"
              inputmode="numeric"
            />
            <input
              v-else
              v-model.trim="form.cui"
              placeholder="CUI (ex: RO123...)"
            />

            <button :disabled="!canSubmit" @click="addClient">Adaugă</button>
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
      editId: "",
      editForm: { type: "", name: "", email: "", cnp: "", cui: "" },
    };
  },

  computed: {
    clients() {
      return this.$store.state.data.clients;
    },

    filteredClients() {
      const q = (this.q || "").toLowerCase().trim();
      let arr = (this.clients || []).filter((c) =>
        (c.name || "").toLowerCase().includes(q)
      );

      if (this.sortBy === "name_asc") {
        arr = [...arr].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      }
      if (this.sortBy === "name_desc") {
        arr = [...arr].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      }
      if (this.sortBy === "newest") {
        arr = [...arr].sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || "")
        );
      }

      return arr;
    },

    canSubmit() {
      // minim pentru UX: nu lăsa butonul activ când lipsesc câmpuri obligatorii
      if (!this.form.type) return false;
      if (!this.form.name?.trim()) return false;

      if (this.form.type === "PF") return /^\d{13}$/.test(this.form.cnp || "");
      return (this.form.cui || "").trim().length > 0;
    },
  },

  watch: {
    "form.type"(newType) {
      // când schimbi tipul, curăță câmpurile care nu se aplică
      this.error = "";
      if (newType === "PF") {
        this.form.cui = "";
      } else {
        this.form.cnp = "";
      }
    },
  },

  created() {
    console.log("ClientsView creat- Incarcă lista cu clienți și verifică dacă aceasta este goală.");
    if ((this.$store.state.data.clients || []).length === 0) {
      this.importDemo();
    }
  },

  mounted() {
    console.log("ClientsView montat- Listă cu clienț este încărcată");
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

      const type = (this.form.type || "").trim();
      const name = (this.form.name || "").trim();
      const email = (this.form.email || "").trim();
      const cnp = (this.form.cnp || "").trim();
      const cui = (this.form.cui || "").trim();

      if (!type) {
        this.error = "Tip client obligatoriu.";
        return false;
      }

      if (!name) {
        this.error = "Nume/Denumire obligatoriu.";
        return false;
      }

      // email opțional, validare regex
      if (email) {
        const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!okEmail) {
          this.error = "Email invalid.";
          return false;
        }
      }

      if (type === "PF") {
        if (!/^\d{13}$/.test(cnp)) {
          this.error = "CNP trebuie să aibă 13 cifre.";
          return false;
        }
      } else {
        if (!cui) {
          this.error = "CUI obligatoriu pentru PFA/PJ.";
          return false;
        }
      }

      return true;
    },

    addClient() {
      if (!this.validate()) return;

      // normalizează payload-ul (curăță ce nu se aplică)
      const payload = {
        type: this.form.type.trim(),
        name: this.form.name.trim(),
        email: (this.form.email || "").trim(),
        cnp: this.form.type === "PF" ? (this.form.cnp || "").trim() : "",
        cui: this.form.type !== "PF" ? (this.form.cui || "").trim() : "",
      };

      this.$store.commit("data/addClient", payload);

      this.form = { type: "", name: "", email: "", cnp: "", cui: "" };
      this.error = "";
    },
    
    async importDemo() {
      console.log("Se apelează acțiunea async...");
      await this.$store.dispatch("data/importDemoClientsAsync");
    },

    startEdit(client) {
      this.editId = client.id;
      this.editForm = {
        type: client.type || "",
        name: client.name || "",
        email: client.email || "",
        cnp: client.cnp || "",
        cui: client.cui || "",
        };
      },

    cancelEdit() {
      this.editId = "";
      this.editForm = { type: "", name: "", email: "", cnp: "", cui: "" };
    },

    saveEdit(id) {
      const type = this.editForm.type;
      const name = (this.editForm.name || "").trim();
      const email = (this.editForm.email || "").trim();
      const cnp = (this.editForm.cnp || "").trim();
      const cui = (this.editForm.cui || "").trim();

      if (!type) return alert("Tip client obligatoriu.");
      if (!name) return alert("Nume/Denumire obligatoriu.");

      // vaidare email
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return alert("Email invalid.");
        }

      if (type === "PF") {
        if (!/^\d{13}$/.test(cnp)) {
          return alert("CNP trebuie să aibă 13 cifre.");
        }
      } 
      else {
        if (!cui) {
          return alert("CUI obligatoriu pentru PFA/PJ.");
          }
      }

      this.$store.commit("data/updateClient", {
        id,
        type,
        name,
        email,
        cnp,
        cui,
      });

      this.cancelEdit();
    }
  },
};
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

input,
select {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px 10px;
}

button {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}

.err {
  color: #b00020;
  margin: 0;
}

.editBox{ margin-top:12px; padding:12px; border:1px solid #eee; border-radius:12px; background:#fff; }

</style>