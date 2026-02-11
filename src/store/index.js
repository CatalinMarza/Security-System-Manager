import { createStore } from "vuex";
import data from "./modules/data";
import user from "./modules/user";

const STORE_KEY = "service_manager_store_v1";

const store = createStore({
  modules: { data, user },
});

// load
const saved = localStorage.getItem(STORE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    store.commit("data/hydrate", parsed);
  } catch {
    // ignore
  }
}

// save on every mutation
store.subscribe((mutation, state) => {
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify({ data: state.data, user: state.user })
  );
});

export default store;
