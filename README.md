Security Systems Manager
Single Page Application – Vue 3

##Descriere generală
Security Systems Manager este o aplicație SPA realizată cu Vue 3 pentru gestionarea clienților, catalogului de echipamente/servicii și ofertelor într-o firmă de sisteme de securitate.

##Funcționalități:
- administrare clienți (PF / PFA / PJ)
- catalog echipamente și servicii
- creare și editare oferte
- calcul automat total
- persistență localStorage
- operații asincrone demo

##Tehnologii:
Vue 3, Vue Router, Vuex, Fetch API, localStorage, CSS Grid/Flexbox

##Componente
Componente reutilizabile: BaseCard, ClientList, ClientRow, AppNav, AppFooter
Views: HomeView, ClientsView, CatalogView, OfferFormView, ClientDetailsView, ClientOverview, ClientOffers

##ROUTING
Rute statice: /, /clients, /catalog, /offers/new
Rută dinamică: /clients/:id
Nested routes: overview, offers
Navigare prin router-link și this.$router.push()

##MANIPULAREA DATELOR
v-model pentru formulare, căutare, selectare și cantități (v-model.number)
Validări pentru clienți, catalog și oferte
Filtrare și sortare liste

##PERSISTENȚĂ DATELOR
Date salvate automat în localStorage prin Vuex

##PROPS ȘI EVENIMENTE
Props: title, clients, client, id
Evenimente: open, edit, remove

##LIFECYCLE
created – încărcare demo
mounted – titlu pagină, timer
beforeUnmount – cleanup timer

##VUEX
State: clients, catalog, offers, user
Mutations: add/update/delete
Actions: importDemoClientsAsync
Getters: clientById

##RESPONSIVE
Layout adaptiv cu media queries

##ASYNC
Fetch demo + try/catch
Ceas live HomeView

Rulare:
npm install
npm run dev
