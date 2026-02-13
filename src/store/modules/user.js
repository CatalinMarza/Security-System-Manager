export default {
  namespaced: true,
  state: () => ({
    name: "Guest",
    role: "viewer",
    loggedIn: false,
    avatar: "https://i.pravatar.cc/40?img=10"

  }),
  mutations: {
    setName(state, name) {
      state.name = name;
    },
    login(state, { name, role }) {
      state.loggedIn = true;
      state.name = name;
      state.role = role || "user";
    },
    logout(state) {
      state.loggedIn = false;
      state.name = "Guest";
      state.role = "viewer";
    },
  },
  actions: {
    loginAsync({ commit }, payload) {
      // simulare async (ca exemplu)
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("login", payload);
          resolve();
        }, 300);
      });
    },
  },
};
