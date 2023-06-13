<template>
  <v-app class="pa-0 ma-0">
    <notificacao />
    <router-view />
    <atualizarVersao :snackbar="snackbar" @atualizarVersao="atualizar()" />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",

  data: () => ({
    snackbar: false,
  }),

  computed: {
    ...mapState("app", ["titulo"]),
    versao() {
      return process.env.VUE_APP_VERSION;
    },
  },

  created() {
    setTimeout(() => {
      if (localStorage.getItem("igtrato:tema")) {
        localStorage.removeItem("igtrato:tema");
      }

      const versao = localStorage.getItem("igtrato:versao")
        ? JSON.parse(window.atob(localStorage.getItem("igtrato:versao")))
        : null;
      if (!versao || versao !== this.versao) {
        localStorage.setItem(
          "igtrato:versao",
          window.btoa(JSON.stringify(this.versao))
        );

        window.location.reload(true);
      }

      this.verificarAtualizacao();

      if (localStorage.getItem("igtrato:updated-at")) {
        const { updatedAt } = this.$obterFiltros("igtrato:updated-at");
        if (updatedAt && this.$day(updatedAt).isBefore(this.$day(), "day")) {
          // Estados da tela do usuário
          localStorage.removeItem("igtrato:estado-recebimento-bovinos");
          localStorage.removeItem("igtrato:estado-lote-seringa");
          localStorage.removeItem("igtrato:estado-lote-pos-morte");

          // Filtros do usuário
          localStorage.removeItem("igtrato:filtro-atendimento-lotes");
          localStorage.removeItem("igtrato:filtro-sequencia-lotes");
          localStorage.removeItem("igtrato:filtro-refugo-bovinos");
          localStorage.removeItem("igtrato:filtro-recebimento-bovinos");
          localStorage.removeItem("igtrato:filtro-programacao-mobile");
          localStorage.removeItem("igtrato:filtro-conferencia-seringa");
        }
      }
    }, 100);
  },

  metaInfo() {
    return {
      title: this.titulo || "IGTRATO",
      titleTemplate: "%s",
    };
  },

  methods: {
    atualizar() {
      window.location.reload(true);
    },
    verificarAtualizacao() {
      const versao = localStorage.getItem("igtrato:versao")
        ? JSON.parse(window.atob(localStorage.getItem("igtrato:versao")))
        : null;
      if (!versao || versao !== this.versao) {
        this.snackbar = true;
      }

      setTimeout(() => {
        this.verificarAtualizacao();
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
.v-badge--dot .v-badge__badge {
  width: 10px !important;
  height: 10px !important;
  border: solid 2px #000 !important;
}

::-webkit-scrollbar {
  width: 12px !important;
  height: 12px !important;
}
::-webkit-scrollbar-track {
  background: #fff !important;
  width: 0px !important;
  height: 6px !important;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc !important;
  border-radius: 0px !important;
  border: 0px solid #ccc !important;
  width: 12px !important;
  height: 6px !important;
}
::-webkit-scrollbar-button {
  background-color: #ccc !important;
  border-radius: 0px !important;
  border: 0px solid #eee !important;
  width: 0px !important;
  height: 0px !important;
}
body {
  scrollbar-color: #fff !important;
}

.v-input {
  color: #000 !important;
  font-weight: 400 !important;
}
.v-label.theme--light {
  color: #000 !important;
  font-weight: 400 !important;
}
.theme--light.v-label--is-disabled {
  color: #000 !important;
  font-weight: 400 !important;
}
.theme--light.v-input--is-disabled {
  color: #000 !important;
  background: #eeeeee !important;
  font-weight: bold !important;
  font-weight: 400 !important;
}

.theme--light.v-input--is-disabled input,
.theme--light.v-input--is-disabled textarea {
  color: #000 !important;
  font-weight: 400 !important;
}
.theme--light.v-select .v-select__selection--disabled {
  color: #000 !important;
  background: #eeeeee !important;
  font-weight: 400 !important;
}
.theme--light.v-data-table {
  color: #000 !important;
  font-weight: 500 !important;
}

.v-select__selections {
  flex-wrap: nowrap !important;
}

.v-data-table {
  white-space: nowrap !important;
}

.v-textarea textarea {
  line-height: 1.3rem !important;
}
@import "./assets/css/app.scss";
</style>
