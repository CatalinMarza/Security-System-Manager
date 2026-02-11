function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default {
  namespaced: true,
  state: () => ({
    clients: [],
    catalog: [],
    offers: [],
  }),

  getters: {
    clientById: (state) => (id) => state.clients.find((c) => c.id === id),
  },

  mutations: {
    hydrate(state, rootState) {
      if (rootState?.data) {
        state.clients = rootState.data.clients || [];
        state.catalog = rootState.data.catalog || [];
        state.offers = rootState.data.offers || [];
      }
    },

    seedIfEmpty(state) {
      if (state.catalog.length === 0) {
        state.catalog = [
          { id: uid("cat"), type: "produs", name: "Cameră IP 4MP (PoE)", price: 320 },
          { id: uid("cat"), type: "produs", name: "NVR 8 canale", price: 650 },
          { id: uid("cat"), type: "produs", name: "Senzor ușă/geam", price: 45 },
          { id: uid("cat"), type: "produs", name: "Centrală alarmă + tastatură", price: 520 },

          { id: uid("cat"), type: "serviciu", name: "Montaj cameră", price: 150 },
          { id: uid("cat"), type: "serviciu", name: "Configurare NVR + rețea", price: 200 },
          { id: uid("cat"), type: "serviciu", name: "Mentenanță lunară", price: 120 },
        ];
      }
    },

    addClient(state, client) {
      state.clients.unshift({ ...client, id: uid("cli"), createdAt: new Date().toISOString() });
    },
    addCatalogItem(state, item) {
      state.catalog.unshift({ ...item, id: uid("cat") });
    },

    deleteClient(state, clientId) {
      state.clients = state.clients.filter((c) => c.id !== clientId);
      state.offers = state.offers.filter((o) => o.clientId !== clientId);
    },
    addOffer(state, offer) {
      state.offers.unshift({ ...offer, id: uid("off") });
    },
    deleteOffer(state, offerId) {
      state.offers = state.offers.filter((o) => o.id !== offerId);
    },
    updateOffer(state, updated) {
      const idx = state.offers.findIndex((o) => o.id === updated.id);
      if (idx === -1) return;
      state.offers[idx] = { ...state.offers[idx], ...updated };
    },
  },

  actions: {
    async importDemoClientsAsync({ commit }) {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await res.json();
      users.slice(0, 5).forEach((u) => {
        commit("addClient", {
          type: "PJ",
          name: u.company?.name || u.name,
          email: u.email,
          phone: u.phone,
          cui: "RO" + String(Math.floor(Math.random() * 9000000 + 1000000)),
        });
      });
    },
  },
};
