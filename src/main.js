import "@/plugins/opcoes";
import "@/plugins/axios";
import "@/plugins/dayjs";
import "@/plugins/crypto";
import "@/plugins/notificacao";
import "@/plugins/registrar_modulo";
import "@/plugins/validate";
import "@/plugins/validate_error";
import "@/plugins/query_url_update";
import "@/plugins/salvar_filtros_local";
import SortableTable from "./plugins/sortable";

import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

import InputFacade from "vue-input-facade";
import VMoeda from "@tiig/v-moeda";
import VUppercase from "@tiig/v-uppercase";
import VueMeta from "vue-meta";

Vue.component("atualizarVersao", () => import("./components/atualizar_versao"));
Vue.component("auditoria", () => import("./components/auditoria"));
Vue.component("autorizacao", () => import("./components/autorizacao"));
Vue.component("aviso", () => import("./components/aviso"));
Vue.component("dateRange", () => import("./components/data_range"));
Vue.component("date-picker", () => import("./components/componenteData"));

Vue.component("pesquisaUsuario", () => import("./components/usuario"));

Vue.component("tt-btn", () => import("./components/tooltip_btn"));
Vue.component("filtro", () => import("./components/filtro"));
Vue.component("filtro-mobile", () => import("./components/filtro_mobile"));
Vue.component("loading", () => import("./components/loading"));
Vue.component("modal", () => import("./components/modal"));
Vue.component("notificacao", () => import("./components/notificacao"));
// Vue.component("server-offline", () => import("./components/server_offline"));
Vue.component("pagina", () => import("./components/pagina"));
Vue.component("qrcode", () => import("./components/qrcode"));

Vue.component("tabela", () => import("./components/tabela"));
Vue.component("tabela-mult-sort-server", () =>
  import("./components/tabela_multi_sort_server")
);

Vue.component("totais", () => import("./components/totais"));
Vue.component("totaisTable", () => import("./components/totais_table"));
Vue.component("select-link", () => import("./components/select_link"));
Vue.component("select-all", () => import("./components/select_all"));

Vue.config.productionTip = false;

Vue.component("v-style", {
  render: function (createElement) {
    return createElement("style", this.$slots.default);
  },
});

Vue.mixin({
  beforeCreate() {
    if (this.$attrs.storePath && this.$attrs.storeName) {
      const path = this.$attrs.storePath;
      const modulo = require(`@/views${path}/`);

      this.$registrarModulo(this.$attrs.storeName, modulo.default);
    }
  },
  methods: {
    mascara(parametro = "T", tamanho = 50) {
      return parametro.repeat(tamanho);
    },
  },
});

Vue.filter("highlight", function (word, query) {
  var queryString = String(query);

  if (queryString) {
    const check = new RegExp(
      `(?=(${queryString
        .split(" ")
        .filter((el) => {
          return !!el;
        })
        .join("|")}+))+\\1`,
      "gi"
    );
    return word.toString().replace(check, function (matchedText, a, b) {
      return '<span class="highlight_word">' + matchedText + "</span>";
    });
  } else {
    return word;
  }
});

const options = {
  // rename the directive from: v-facade to: v-mask
  name: "mask",

  // use these tokens instead of the default
  tokens: {
    "#": { pattern: /\d/ },
    a: { pattern: /[a-z]/i },
    N: { pattern: /[0-9a-z]/i },
    X: { pattern: /./ },

    H: { pattern: /[0-9,]/ },
    E: { pattern: /.+/ },
    A: { pattern: /[a-zA-ZÀ-ú0-9]/ },
    B: {
      pattern: /[a-zA-Z0-9_-]/,
      transform: (v) => {
        return v.toLocaleUpperCase();
      },
    },
    G: {
      pattern: /[a-zA-Zà-ùÀ-Ú\s]/,
      transform: (v) => {
        return v.toLocaleUpperCase();
      },
    },
    L: { pattern: /[a-zA-Z0-9_-]/ },
    T: {
      pattern: /./,
      transform: (v) => {
        return v.toLocaleUpperCase();
      },
    },
  },
};

Vue.directive("sortable-table", SortableTable);

Vue.use(InputFacade, options);
Vue.use(VUppercase);
Vue.use(VMoeda);
Vue.use(VueMeta);

import Chart from "chart.js";
import Chartkick from "vue-chartkick";
Vue.use(Chartkick.use(Chart));

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
