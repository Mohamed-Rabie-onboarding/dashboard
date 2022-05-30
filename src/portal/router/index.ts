import { RouteConfig } from "vue-router";
import AccountsView from '@/portal/views/Accounts.vue';
import AccountView from '@/portal/views/Account.vue'
import TwinView from "@/portal/views/Twin.vue";
import TransferView from "@/portal/views/Transfer.vue";
import FarmsView from "@/portal/views/Farms.vue";
import NodesView from "@/portal/views/Nodes.vue";
export const portalRouter: RouteConfig[] = [
  { path: "/", 
  name:"accounts",
  component: AccountsView },
  { path: "/:accountID",
   name: "account", 
   component: AccountView 
 },
 { path: "/:accountID/account-twin", 
 name: "account-twin", 
 component: TwinView },
 { path: "/:accountID/account-transfer", 
 name: "account-transfer", 
 component: TransferView },
 { path: "/:accountID/account-farms", 
 name: "account-farms", 
 component: FarmsView },
 { path: "/:accountID/account-nodes", 
 name: "account-nodes", 
 component: NodesView },

];