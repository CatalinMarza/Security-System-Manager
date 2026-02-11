<template>
  <div>
    <div class="top">
      <strong>Oferte client</strong>
      <button class="btn" @click="goNewOffer">Ofertă nouă</button>
    </div>

    <p v-if="offers.length === 0" class="muted">
      Nu există oferte pentru acest client.
    </p>

    <div v-else class="list">
      <div class="card" v-for="o in offers" :key="o.id">
        <div class="row">
          <div>
            <div class="title">Oferta #{{ o.id.slice(-6) }}</div>

            <div class="meta">
              <span class="badge">{{ o.date }}</span>
              <span class="badge">Total: {{ offerTotal(o) }} lei</span>
              <span class="badge">Linii: {{ o.lines?.length || 0 }}</span>
            </div>

            <div class="editRow">
              <label class="smallLbl">Status</label>
              <select
                class="select"
                :disabled="editId !== o.id"
                v-model="drafts[o.id].status"
              >
                <option>Draft</option>
                <option>Trimis</option>
                <option>Acceptat</option>
              </select>
            </div>
          </div>

          <div class="actions">
            <button class="btn" @click="toggle(o.id)">
              {{ openId === o.id ? "Ascunde" : "Detalii" }}
            </button>

            <button class="btn" v-if="editId !== o.id" @click="startEdit(o)">
              Editează
            </button>

            <button class="btn" v-else @click="saveEdit(o.id)">
              Salvează
            </button>

            <button class="btn" v-if="editId === o.id" @click="cancelEdit">
              Anulează
            </button>

            <button class="btn btn-danger" @click="remove(o.id)">Șterge</button>
          </div>
        </div>

        <div v-if="openId === o.id" class="details">
          <div class="line" v-for="(l, idx) in drafts[o.id].lines" :key="idx">
            <div>
              <strong>{{ itemName(l.itemId) }}</strong>
              <div class="small">
                {{ itemType(l.itemId) }} · preț {{ l.price }} lei
              </div>
            </div>

            <div class="right">
              <input
                class="input qty"
                type="number"
                min="1"
                v-model.number="drafts[o.id].lines[idx].qty"
                :disabled="editId !== o.id"
              />
              <div class="sum">
                {{ Number(l.qty) * Number(l.price) }} lei
              </div>
            </div>
          </div>

          <!-- ADĂUGARE LINIE NOUĂ (doar în modul edit) -->
          <div v-if="editId === o.id" class="addLineBox">
            <strong>Adaugă linie</strong>

            <div class="lineAdd">
              <select class="select" v-model="drafts[o.id]._newItemId">
                <option disabled value="">Echipament/Serviciu</option>
                <option v-for="i in catalog" :key="i.id" :value="i.id">
                  {{ i.name }} ({{ i.type }}) - {{ i.price }} lei
                </option>
              </select>

              <input
                class="input qty"
                type="number"
                min="1"
                v-model.number="drafts[o.id]._newQty"
              />
              <button class="btn" @click="addNewLine(o.id)">Adaugă</button>
            </div>
          </div>

          <div class="totalLine">
            Total (draft): <strong>{{ draftTotal(o.id) }} lei</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientOffers",
  props: { id: { type: String, required: true } },
  data() {
    return {
      openId: "",
      editId: "",
      drafts: {}, // { [offerId]: { status, lines, _newItemId, _newQty } }
    };
  },
  computed: {
    offers() {
      return this.$store.state.data.offers.filter((o) => o.clientId === this.id);
    },
    catalog() {
      return this.$store.state.data.catalog;
    },
  },
  watch: {
    offers: {
      immediate: true,
      handler(list) {
        const next = {};
        list.forEach((o) => {
          next[o.id] = {
            status: o.status || "Draft",
            lines: (o.lines || []).map((l) => ({
              itemId: l.itemId,
              qty: Number(l.qty),
              price: Number(l.price),
            })),
            _newItemId: "",
            _newQty: 1,
          };
        });
        this.drafts = next;
      },
    },
  },
  methods: {
    goNewOffer() {
      this.$router.push(`/offers/new?clientId=${this.id}`);
    },
    toggle(offerId) {
      this.openId = this.openId === offerId ? "" : offerId;
    },
    remove(offerId) {
      this.$store.commit("data/deleteOffer", offerId);
      if (this.openId === offerId) this.openId = "";
      if (this.editId === offerId) this.editId = "";
    },

    startEdit(offer) {
      this.editId = offer.id;
      this.openId = offer.id;
    },
    cancelEdit() {
      this.editId = "";
      // refacem drafturile din store
      const list = this.offers;
      const next = {};
      list.forEach((o) => {
        next[o.id] = {
          status: o.status || "Draft",
          lines: (o.lines || []).map((l) => ({
            itemId: l.itemId,
            qty: Number(l.qty),
            price: Number(l.price),
          })),
          _newItemId: "",
          _newQty: 1,
        };
      });
      this.drafts = next;
    },

    addNewLine(offerId) {
      const d = this.drafts[offerId];
      if (!d) return;

      if (!d._newItemId) return alert("Alege un echipament/serviciu.");
      if (Number(d._newQty) <= 0) return alert("Cantitate > 0.");

      const item = this.$store.state.data.catalog.find((x) => x.id === d._newItemId);
      if (!item) return alert("Item invalid.");

      d.lines.push({
        itemId: item.id,
        qty: Number(d._newQty),
        price: Number(item.price),
      });

      d._newItemId = "";
      d._newQty = 1;
    },

    saveEdit(offerId) {
      const d = this.drafts[offerId];
      if (!d) return;

      for (const l of d.lines) {
        if (Number(l.qty) <= 0) return alert("Cantitatea trebuie să fie > 0");
      }

      const total = d.lines.reduce((s, l) => s + Number(l.qty) * Number(l.price), 0);

      this.$store.commit("data/updateOffer", {
        id: offerId,
        status: d.status,
        lines: d.lines,
        total,
      });

      this.editId = "";
    },

    offerTotal(o) {
      if (typeof o.total === "number") return o.total;
      return (o.lines || []).reduce((s, l) => s + Number(l.qty) * Number(l.price), 0);
    },
    draftTotal(offerId) {
      const d = this.drafts[offerId];
      if (!d) return 0;
      return d.lines.reduce((s, l) => s + Number(l.qty) * Number(l.price), 0);
    },

    itemById(itemId) {
      return this.$store.state.data.catalog.find((x) => x.id === itemId);
    },
    itemName(itemId) {
      return this.itemById(itemId)?.name || "Item";
    },
    itemType(itemId) {
      return this.itemById(itemId)?.type || "-";
    },
  },
};
</script>

<style scoped>
.top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
}
.muted{ color:#666; }
.list{ display:flex; flex-direction:column; gap:10px; }

.card{
  border:1px solid #eee;
  border-radius:12px;
  padding:12px;
  background:#fff;
}
.row{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:12px;
}
.title{ font-weight:800; }
.meta{ display:flex; gap:6px; margin-top:6px; flex-wrap:wrap; }
.actions{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

.details{
  margin-top:10px;
  border-top:1px solid #eee;
  padding-top:10px;
}

.line{
  display:flex;
  justify-content:space-between;
  gap:12px;
  padding:8px 0;
  border-bottom:1px dashed #eee;
}
.right{ display:flex; gap:10px; align-items:center; }
.qty{ width:90px; }
.small{ font-size:13px; color:#666; margin-top:4px; }
.sum{ font-weight:800; white-space:nowrap; }

.editRow{ margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.smallLbl{ font-size:13px; color:#666; }

.addLineBox{ margin-top:10px; padding-top:10px; border-top:1px dashed #eee; }
.lineAdd{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:8px; }

.totalLine{ margin-top:10px; text-align:right; }
</style>
