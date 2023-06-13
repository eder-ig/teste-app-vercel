<template>
  <v-data-iterator
    v-model="selected"
    :class="
      flat ? 'elevation-0 componente-tabela' : 'elevation-2 componente-tabela'
    "
    :disable-pagination="semRodape"
    :expanded.sync="expanded"
    :height="height"
    :item-key="itemKey"
    :items="linhas"
    :items-per-page="rowsPerPage"
    :loading="loading"
    :mobile-breakpoint="0"
    :page="page"
    :server-items-length="itensServidor"
    :show-select="selecionar"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :single-expand="expand"
    :show-expand="expand"
    dense
    fixed-header
    hide-default-footer
  >
    <template v-slot:header>
      <v-row
        v-if="rodapeSecundario"
        class="d-flex align-center justify-space-between px-2 py-2"
        dense
      >
        <v-btn
          :disabled="loading || desabilitarPaginaAnterior"
          class="mr-3 elevation-2"
          color="#358283"
          icon
          width="15"
          height="15"
          @click="requisicao({ page: --page })"
        >
          <v-icon size="16"> mdi-chevron-left </v-icon>
        </v-btn>

        <div class="centro">
          <span class="subtitle-2"
            >Itens: <b class="ml-1">{{ totalRegistrosRodape }}</b></span
          >
          <span class="subtitle-2"
            >{{ paginaAtual }} &nbsp;-&nbsp; {{ totalPaginas || 1 }}</span
          >
        </div>

        <v-btn
          :disabled="loading || desabilitarPaginaPosterior"
          class="ml-3 elevation-2"
          color="#358283"
          icon
          width="15"
          height="15"
          @click="requisicao({ page: ++page })"
        >
          <v-icon size="16"> mdi-chevron-right </v-icon>
        </v-btn>
        <!-- <v-btn
          :disabled="loading || desabilitarPaginaPosterior"
          @click="requisicao({page: totalPaginas})"
          class="mr-1 elevation-2"
          color="#358283"
          icon
          width="50"
          height="50"
        >
          <v-icon size="50">
            mdi-chevron-double-right
          </v-icon>
        </v-btn> -->
      </v-row>
    </template>
    <template v-slot:default="{ items }">
      <v-row
        v-if="rodapePrimario && !rodapeSecundario && !telaSelecinarTerminal"
        :style="{ height: altura ? `${altura}px` : '' }"
        class="mx-0 justify-start"
      >
        <div v-for="(item, key) in items" :key="key" class="coluna">
          <slot name="card" :item="item" />
        </div>
      </v-row>
      <div
        v-if="rodapePrimario && rodapeSecundario && !telaSelecinarTerminal"
        :style="{ height: altura ? `${altura}px` : '' }"
      >
        <v-row class="d-flex">
          <v-col
            v-for="(item, key) in items"
            :key="key"
            class="d-flex"
            cols="3"
          >
            <slot :item="item" name="card" />
          </v-col>
        </v-row>
      </div>
      <div
        v-if="telaSelecinarTerminal"
        :style="{ height: altura ? `${altura}px` : '' }"
      >
        <slot :item="items" name="card" />
      </div>
    </template>
    <template v-if="!semRodape" v-slot:footer>
      <div v-if="rodapePrimario && !rodapeSecundario" class="footer mt-4">
        <div class="buttons">
          <v-btn
            :disabled="loading || desabilitarPaginaAnterior"
            class="elevation-2"
            color="#358283"
            icon
            width="30"
            height="30"
            @click="requisicao({ page: 1 })"
          >
            <v-icon size="16" color=""> mdi-chevron-double-left </v-icon>
          </v-btn>
          <v-btn
            :disabled="loading || desabilitarPaginaAnterior"
            class="mr-3 elevation-2"
            color="#358283"
            icon
            width="30"
            height="30"
            @click="requisicao({ page: --page })"
          >
            <v-icon size="16"> mdi-chevron-left </v-icon>
          </v-btn>
          <span style="font-size: 0.7rem"
            >{{ paginaAtual }} &nbsp;-&nbsp; {{ totalPaginas || 1 }}</span
          >
          <v-btn
            :disabled="loading || desabilitarPaginaPosterior"
            class="ml-3 elevation-2"
            color="#358283"
            icon
            width="30"
            height="30"
            @click="requisicao({ page: ++page })"
          >
            <v-icon size="16"> mdi-chevron-right </v-icon>
          </v-btn>
          <v-btn
            :disabled="loading || desabilitarPaginaPosterior"
            class="mr-1 elevation-2"
            color="#358283"
            icon
            width="30"
            height="30"
            @click="requisicao({ page: totalPaginas })"
          >
            <v-icon size="16"> mdi-chevron-double-right </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <template v-slot:no-data>
      <div
        :style="{ height: altura ? `${altura}px` : '' }"
        class="d-flex justify-center align-center"
      >
        <span class="font-weight-bold">{{ semItens }}</span>
      </div>
    </template>
  </v-data-iterator>
</template>

<script>
import moeda from "@tiig/moeda";

export default {
  name: "ComponenteTabela",
  props: {
    acessar: {
      default: false,
      type: Boolean,
    },
    altura: {
      type: Number,
      default: null,
    },
    btnExpand: {
      default: false,
      type: Boolean,
    },
    btnExpandUndo: {
      default: false,
      type: Boolean,
    },
    corToolbar: {
      type: String,
      default: null,
    },
    desabilitado: {
      default: false,
      type: Boolean,
    },
    desabilitadoMover: {
      default: false,
      type: Boolean,
    },
    expand: {
      default: false,
      type: Boolean,
    },
    exibir: {
      default: false,
      type: Boolean,
    },
    excluir: {
      default: false,
      type: Boolean,
    },
    editar: {
      default: false,
      type: Boolean,
    },
    escolher: {
      default: false,
      type: Boolean,
    },
    flat: {
      default: false,
      type: Boolean,
    },
    footer: {
      default: () => {
        return [];
      },
      type: Array,
    },
    height: {
      default: "",
      type: String,
    },
    itemKey: {
      default: "id",
      type: String,
    },
    linhasPorPagina: {
      default: 8,
      type: Number,
    },
    linhas: {
      required: true,
      type: Array,
    },
    loading: {
      default: false,
      type: Boolean,
    },
    modeDown: {
      default: false,
      type: Boolean,
    },
    moveUp: {
      default: false,
      type: Boolean,
    },
    paginacao: {
      type: Object,
      default: () => ({}),
    },
    paginacaoServidor: {
      default: false,
      type: Boolean,
    },
    rodapePrimario: {
      type: Boolean,
      default: true,
    },
    rodapeSecundario: {
      type: Boolean,
      default: false,
    },
    selecionar: {
      default: false,
      type: Boolean,
    },
    semRodape: {
      default: false,
      type: Boolean,
    },
    semItens: {
      type: String,
      default: "Não há dados disponíveis",
    },
    subtitulo: {
      default: "",
      type: String,
    },
    telaSelecinarTerminal: {
      default: false,
      type: Boolean,
    },
    toolbarGrid: {
      default: false,
      type: Boolean,
    },
    titulo: {
      default: "",
      type: String,
    },
    toolbarHight: {
      type: Number,
      default: 35,
    },
    voltarListagem: {
      default: false,
      type: Boolean,
    },
    tituloVoltar: {
      default: "Voltar Listagem",
      type: String,
    },
  },
  data() {
    return {
      expanded: [],
      rowsPerPage: 4,
      page: 1,
      sortBy: [],
      sortDesc: [],
      selected: [],
      fabs: {},
    };
  },
  computed: {
    desabilitarPaginaAnterior() {
      return this.paginacaoServidor
        ? this.paginacao.pagina === 1 || this.paginacao.pagina === undefined
        : this.page === 1;
    },
    desabilitarPaginaPosterior() {
      return this.paginacaoServidor
        ? this.paginacao.pagina === this.paginacao.totalPaginas ||
            this.paginacao.totalPaginas === 0
        : this.page === Math.ceil(this.linhas.length / this.rowsPerPage) ||
            Math.ceil(this.linhas.length / this.rowsPerPage) === 0;
    },
    itensServidor() {
      return this.paginacaoServidor ? this.paginacao.totalRegistros : -1;
    },
    paginaAtual() {
      return this.paginacaoServidor ? this.paginacao.pagina : this.page;
    },
    totalPaginas() {
      return this.paginacaoServidor
        ? this.paginacao.totalPaginas
        : Math.ceil(this.linhas.length / this.rowsPerPage);
    },
    totalRegistros() {
      return this.paginacaoServidor
        ? this.paginacao.totalRegistros
        : this.linhas.length;
    },
    totalRegistrosRodape() {
      return this.paginacaoServidor
        ? moeda.format(this.paginacao.totalRegistros, 0)
        : moeda.format(this.linhas.length, 0);
    },
  },
  watch: {
    expanded(valor) {
      if (valor.length) {
        this.$emit("expandir", this.expanded);
      }
    },
    selected(valor) {
      if (valor) {
        if (this.selected.length) {
          this.$emit("selecionar", this.selected);
        } else {
          this.$emit("selecionar", []);
        }
      }
    },
    sortDesc(valor) {
      if (this.paginacaoServidor) this.requisicao({});
    },
    paginacao: {
      handler(val) {
        if (val) {
          this.rowsPerPage = val.registros;
          this.page = val.pagina;
        }
      },
    },
  },
  created() {
    this.rowsPerPage = this.linhasPorPagina;

    if (this.paginacaoServidor) {
      this.page = this.paginacao.pagina;
      this.rowsPerPage = this.paginacao.registros;
    }
  },
  methods: {
    requisicao({ page, linhas }) {
      let pagina;

      if (linhas) {
        pagina = this.page;
      }

      if (page) {
        if (this.paginacaoServidor) {
          pagina =
            page > this.paginacao.totalPaginas
              ? this.paginacao.totalPaginas
              : page;
        } else {
          pagina =
            page > Math.ceil(this.linhas.length / this.rowsPerPage)
              ? Math.ceil(this.linhas.length / this.rowsPerPage)
              : page;
        }
      }

      this.$emit("paginacao", {
        ordenacao: this.sortBy[0],
        ordenacao_tipo:
          this.sortDesc[0] === true
            ? "desc"
            : this.sortDesc[0] === false
            ? "asc"
            : undefined,
        pagina: pagina,
        registros: this.rowsPerPage,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.coluna {
  width: 95%;
  margin: 5px 10px;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .buttons {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
.itens-por-pagina {
  button {
    border-radius: 30px !important;
    height: 60px !important;
    width: 60px !important;

    span {
      font-size: 24px !important;
    }
  }
}
.toolbar-tabela {
  background: linear-gradient(#6c767b, #263238) !important;
}
.v-item--active {
  color: #358283 !important;
}
.centro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
