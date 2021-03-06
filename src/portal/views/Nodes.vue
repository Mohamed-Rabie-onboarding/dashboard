<template>
  <v-container>
    <v-card
      color="#388E3C"
      class="text-center py-5 my-3 "
    >
      <h3>Howdy {{accountName}}! You can now reserve nodes from other's farms!</h3>
    </v-card>
    <v-text-field
      v-model="searchTerm"
      color="purple darken-2"
      label="Search by node location or ID"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="filteredNodes()"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="nodeId"
      show-expand
      class="elevation-1"
      dark
      sort-by="item.nodeId"
      :loading="loading"
    >
      <template v-slot:[`item.resources.mru`]="{ item }">
        {{ byteToGB(item.resources.mru) }}
      </template>
      <template v-slot:[`item.resources.sru`]="{ item }">
        {{ byteToGB(item.resources.sru) }}
      </template>
      <template v-slot:[`item.resources.hru`]="{ item }">
        {{ byteToGB(item.resources.hru) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <NodeActionBtn :nodeId="item.nodeId" />
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Your Nodes</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.discount`]="{ item }">
        <v-tooltip
          bottom
          color="primary"
          close-delay="700"
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
            >{{ item.discount }} *</span>
          </template>
          <span>Discounts: <br />
            <ul>
              <li>{{item.applyedDiscount.first}}% for the dedicated node</li>
              <li>{{item.applyedDiscount.second}}% for the twin balance</li>
            </ul>
            See
            <a
              target="_blank"
              href="https://library.threefold.me/info/threefold/#/tfgrid/grid/pricing?id=discount-levels"
            >
              <p style="color: blue; display: inline">discount levels</p>
            </a>
          </span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <NodeDetails
            :node="item"
            :byteToGB="byteToGB"
          />
        </td>
      </template>

    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import NodeActionBtn from "@/components/NodeActionBtn.vue";
import NodeDetails from "@/components/NodeDetails.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { getDNodes } from "../lib/nodes";
import { byteToGB } from "../lib/nodes";
@Component({
  name: "NodesView",
  components: { NodeActionBtn, NodeDetails },
})
export default class NodesView extends Vue {
  headers = [
    { text: "Node ID", value: "nodeId" },
    { text: "Location", value: "location.country" },
    { text: "CRU", value: "resources.cru" },
    { text: "HRU (GB)", value: "resources.hru" },
    { text: "MRU (GB)", value: "resources.mru" },
    { text: "SRU (GB)", value: "resources.sru" },
    { text: "Price (USD)", value: "discount" },
    { text: "Actions", value: "actions" },
  ];
  nodes: any = [];
  $api: any;
  singleExpand = true;
  expanded: any = [];
  loading = false;
  address = "";
  searchTerm = "";
  accountName: any = "";

  async mounted() {
    this.address = this.$route.params.accountID;
    this.accountName = this.$route.query.accountName;
    if (this.$api) {
      this.nodes = await getDNodes(this.$api, this.address);
    } else {
      this.$router.push({
        name: "accounts",
        path: "/",
      });
    }
  }
  updated() {
    this.address;
  }
  @Watch("$route.params.accountID") async onPropertyChanged(
    value: string,
    oldValue: string
  ) {
    console.log(`removing nodes of ${oldValue}, putting in nodes of ${value}`);
    this.nodes = await getDNodes(this.$api, value);
  }
  public filteredNodes() {
    if (this.searchTerm.length !== 0 && this.nodes.length !== 0) {
      return this.nodes.filter(
        (node: { location: { country: string }; nodeId: any }) =>
          node.location.country
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          `${node.nodeId}`.includes(this.searchTerm)
      );
    }
    return this.nodes;
  }
  byteToGB(capacity: number) {
    return byteToGB(capacity);
  }
}
</script>
<style scoped>
.v-tooltip__content {
  pointer-events: initial;
}
</style>