function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function isValidEmail(email) {
  if (!email) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeClient(input) {
  const type = (input?.type || "").trim();
  const name = (input?.name || "").trim();
  const email = (input?.email || "").trim();
  const cnp = (input?.cnp || "").trim();
  const cui = (input?.cui || "").trim();

  if (!["PF", "PFA", "PJ"].includes(type)) {
    return { ok: false, error: "Tip client invalid (PF/PFA/PJ)." };
  }

  if (!name) {
    return { ok: false, error: "Nume/Denumire obligatoriu." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Email invalid." };
  }

  if (type === "PF") {
    if (!/^\d{13}$/.test(cnp)) {
      return { ok: false, error: "CNP trebuie să aibă 13 cifre." };
    }
    return {
      ok: true,
      client: { type, name, email, cnp, cui: "" }, // force clear cui
    };
  }

  // PFA / PJ
  if (!cui) {
    return { ok: false, error: "CUI obligatoriu pentru PFA/PJ." };
  }

  return {
    ok: true,
    client: { type, name, email, cnp: "", cui }, // force clear cnp
  };
}

export default {
  namespaced: true,

  state: () => ({
    clients: [],
    catalog: [],
    offers: [],
    httpError: "",
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
        state.httpError = rootState.data.httpError || "";
      }
    },

    setHttpError(state, msg) {
      state.httpError = msg || "";
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

    addClient(state, clientPayload) {
      // validare în store
      state.httpError = "";

      const res = normalizeClient(clientPayload);
      if (!res.ok) {
        state.httpError = res.error;
        return;
      }

      state.clients.unshift({
        ...res.client,
        id: uid("cli"),
        createdAt: new Date().toISOString(),
      });
    },

    updateClient(state, updated) {
      const idx = state.clients.findIndex((c) => c.id === updated.id);
       if (idx === -1) return;
      state.clients[idx] = { ...state.clients[idx], ...updated };
    },

    deleteClient(state, clientId) {
      state.clients = state.clients.filter((c) => c.id !== clientId);
      state.offers = state.offers.filter((o) => o.clientId !== clientId);
    },

    addCatalogItem(state, item) {
      state.catalog.unshift({ ...item, id: uid("cat") });
    },

    deleteCatalogItem(state, itemId) {
      state.catalog = state.catalog.filter((i) => i.id !== itemId);
    },

    updateCatalogItem(state, updated) {
      const idx = state.catalog.findIndex((i) => i.id === updated.id);
      if (idx === -1) return;
      state.catalog[idx] = { ...state.catalog[idx], ...updated };
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
      commit("setHttpError", "");

      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("HTTP " + res.status);

        const users = await res.json();

        users.slice(0, 5).forEach((u) => {
                    commit("addClient", {
            type: "PJ",
            name: u.name,
            email: u.email,
            cui: "DEMO-" + String(u.id),
            cnp: "",
          });
        });
      } catch (e) {
        commit("setHttpError", "Eroare la import: " + (e?.message || "necunoscută"));
      }
    },
  },
};