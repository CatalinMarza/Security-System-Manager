import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/HomeView.vue");
const ClientsView = () => import("../views/ClientsView.vue");
const CatalogView = () => import("../views/CatalogView.vue");
const OfferFormView = () => import("../views/OfferFormView.vue");

const ClientDetailsView = () => import("../views/ClientDetailsView.vue");
const ClientOverview = () => import("../views/client/ClientOverview.vue");
const ClientOffers = () => import("../views/client/ClientOffers.vue");


const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/clients", name: "clients", component: ClientsView },
  { path: "/catalog", name: "catalog", component: CatalogView },
  { path: "/offers/new", name: "offer-new", component: OfferFormView },
  { path: "/clients/:id",component: ClientDetailsView, props: true, children: [
    { path: "", redirect: (to) => `/clients/${to.params.id}/overview` },
    { path: "overview", name: "client-overview", component: ClientOverview, props: true },
    { path: "offers", name: "client-offers", component: ClientOffers, props: true },
  ],
},


];

export default createRouter({
  history: createWebHistory(),
  routes,
});
