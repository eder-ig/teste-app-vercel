<template>
  <div>
    <v-row v-if="exibirCampos" dense>
      <v-col v-if="!selecionar" cols="4">
        <v-text-field
          ref="codigo"
          v-model="codigo"
          v-mask="'########'"
          :class="required ? 'required' : ''"
          :clearable="clearable"
          :disabled="disabled"
          :error-messages="error"
          :label="label"
          append-icon="mdi-magnify"
          dense
          hide-details
          outlined
          @click:append="modalFiltro = true"
          @click:clear="reset()"
          @blur="codigo ? listarUsuarioCodigo() : reset()"
          @keydown.enter="codigo ? listarUsuarioCodigo() : reset()"
          @keydown.tab="codigo ? listarUsuarioCodigo() : reset()"
          @keydown.down="codigo ? listarUsuarioCodigo() : reset()"
        />
      </v-col>
      <v-col cols="8">
        <v-text-field
          ref="descricao"
          :value="descricao"
          dense
          disabled
          hide-details
          label="Descrição"
          outlined
        />
      </v-col>
    </v-row>
    <modal
      ref="modalFiltro"
      v-model="modalFiltro"
      :options="optionsModal"
      @input="resetModal()"
      @salvar="salvar()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <v-container fluid grid-list-xs>
          <v-row dense>
            <v-col v-if="selecionar">
              <v-text-field
                ref="codigos"
                v-model="filtro.codigo"
                v-mask="mascara('H', 150)"
                clearable
                hide-details
                label="Código(s)"
                placeholder="123456,456123,..."
                dense
                outlined
                @click:clear="(filtro.codigo = null), listar()"
                @keydown.enter="listar()"
              />
            </v-col>
            <v-col v-if="!selecionar" cols="12" xl="3" lg="3" md="6" sm="12">
              <v-text-field
                ref="codigo"
                v-model="filtro.codigo"
                v-mask="'########'"
                clearable
                dense
                hide-details
                label="Código"
                outlined
                @click:clear="(filtro.codigo = null), listar()"
                @keydown.enter="listar()"
              />
            </v-col>
            <v-col block>
              <v-text-field
                ref="nome"
                v-model="filtro.nome"
                v-mask="mascara('T', 100)"
                clearable
                dense
                hide-details
                label="Nome do Usuário"
                outlined
                @click:clear="(filtro.nome = null), listar()"
                @keydown.enter="listar()"
              />
            </v-col>
          </v-row>
        </v-container>
        <tabela
          :colunas="colunas"
          :escolher="!selecionar"
          :loading="loading"
          :paginacao="{}"
          :registros="registrosUsuarios"
          :selecionados.sync="selecionados"
          :selecionar="selecionar"
          height="600"
          flat
          @escolher="selecionarRegistro($event)"
        />
      </v-form>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ComponentePesquisarUsuarios",

  props: {
    clearable: {
      default: true,
      type: Boolean,
    },
    cargoId: {
      default: null,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "number" ||
          typeof value === "string" ||
          value === null
        );
      },
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    error: {
      type: Array,
      default: () => [],
    },
    exibirCampos: {
      type: Boolean,
      default: true,
    },
    label: {
      default: "Usuário",
      type: String,
    },
    login: {
      default: null,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "number" ||
          typeof value === "string" ||
          value === null
        );
      },
    },
    selecionar: {
      type: Boolean,
      default: false,
    },
    required: {
      default: false,
      type: Boolean,
    },
    usuarioId: {
      required: false,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "number" ||
          typeof value === "string" ||
          value === null
        );
      },
    },
    usuarioIds: {
      type: Array,
      deafault: () => [],
    },
  },

  data: () => ({
    codigo: null,
    nome: null,
    filtro: {
      codigo: null,
      nome: null,
    },
    loading: false,
    modalFiltro: false,
    selecionados: [],
  }),

  computed: {
    ...mapState("app", ["paginacaoUsuarios", "registrosUsuarios"]),
    colunas() {
      const colunas = [];

      if (!this.selecionar) {
        colunas.push({
          text: "Ação",
          align: "center",
          sortable: false,
          value: "acao",
          width: 61,
        });
      }

      colunas.push(
        {
          text: "Código",
          align: "end",
          sortable: true,
          value: "codigo",
          width: 60,
        },
        {
          text: "Nome",
          align: "start",
          sortable: true,
          value: "nome",
          width: 250,
        },
        {
          text: "Cargo",
          align: "start",
          sortable: true,
          value: "cargo",
        },
        {}
      );
      return colunas;
    },
    optionsModal() {
      return {
        title: "Pesquisar Por Usuário",
        width: 1000,
        actions: [
          {
            title: "Salvar",
            hide: !this.selecionar,
            color: "primary",
            dataCy: "btnSalvar",
            icon: "mdi-content-save",
            emit: "salvar",
            outlined: false,
          },
          {
            title: "Cancelar",
            color: "error",
            dataCy: "btnCancelar",
            icon: "mdi-cancel",
            emit: "input",
            outlined: false,
          },
        ],
      };
    },
  },

  watch: {
    usuarioId(valor) {
      if (!valor) this.reset();
    },
    modalFiltro(valor) {
      if (valor) this.listar();
      else this.resetModal();
    },
  },

  created() {
    if ((this.usuarioId || this.login) && !this.filtro.nome) {
      this.listarUsuarioCodigo();
    }
  },

  destroyed() {
    window.removeEventListener("keydown", this.verificarTeclas);
  },

  mounted() {
    window.addEventListener("keydown", this.verificarTeclas);
  },

  methods: {
    ...mapActions("app", ["usuarioListar"]),
    async listarUsuarioCodigo() {
      this.loading = true;

      let res = await this.usuarioListar({
        filtro: JSON.stringify({
          id: this.usuarioId || undefined,
          codigo: this.codigo || undefined,
          login: this.login || undefined,
        }),
      });

      if (res && !res.erro && res.registros.length) {
        this.codigo = res.registros[0].codigo || null;
        this.descricao = res.registros[0].nome || null;
        this.$emit("update:usuarioId", res.registros[0].id);
        this.$emit("update:login", res.registros[0].login);
        this.$emit("update:cargoId", res.registros[0].cargo_id);
        this.$emit("listar");
      } else {
        this.$notificacao("Registro não encontrado!", "erro");
        this.reset();
      }

      this.loading = false;
    },
    async listar(paginacao) {
      this.loading = true;

      const res = await this.usuarioListar({
        ...paginacao,
        filtro: JSON.stringify({
          codigo: this.filtro.codigo || undefined,
          nome: this.filtro.nome || undefined,
        }),
      });
      if (res && !res.erro) this.selecionados = [];

      this.loading = false;
    },
    reset() {
      this.codigo = " ";
      this.descricao = null;
      this.$emit("update:usuarioId", null);
      this.$emit("update:login", null);
      this.$emit("update:cargoId", null);
      this.$emit("listar");
    },
    resetFiltros() {
      this.filtro = {
        codigo: null,
        nome: null,
      };

      this.listar();
    },
    resetModal() {
      this.$store.commit("components/registrosUsuarios", []);
      this.selecionados = [];
      this.modalFiltro = false;
    },
    selecionarRegistro(id) {
      let registro = this.registrosUsuarios.find((item) => item.id === id);
      this.descricao = registro.nome || null;
      this.codigo = registro.codigo || null;
      this.$emit("update:usuarioId", registro.id);
      this.$emit("update:login", registro.login);
      this.$emit("update:cargoId", registro.cargo_id);
      this.$emit("listar");
      this.modalFiltro = false;
    },
    verificarTeclas(event) {
      if (event.keyCode === 114) {
        event.preventDefault();
        this.modalFiltro = true;
      } else if (event.keyCode === 27) {
        this.resetModal();
      }
    },
    salvar() {
      this.$emit("salvar", this.selecionados);
    },
  },
};
</script>
