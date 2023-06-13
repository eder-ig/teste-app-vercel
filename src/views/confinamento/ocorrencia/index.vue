<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Casastro de ocorrência"
    titulo-toolbar="Nova Ocorrência"
    titulo="Ocorrência"
    fechar
    @cancelar="resetFormulario()"
    @editar="(controle.exibir = false), (controle.editar = true)"
    @fechar="resetFormulario()"
    @salvar="salvarRegistro()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @excluir="
        (aviso = { modal: false, key: null, text: '' }), excluirRegistro()
      "
    />

    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Tipo Ocorrência"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Data"
                  rules="required"
                  vid="data"
                >
                  <date-picker
                    v-model="formulario.data"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    label="Data"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col
                v-if="controle.inserir"
                cols="12"
                xl="2"
                lg="4"
                md="4"
                xs="12"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="Piquete/Lote"
                  rules="required"
                  vid="piqueteId"
                >
                  <v-autocomplete
                    v-model="formulario.piqueteId"
                    :items="dropdownLotesAtivos"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="piqueteId"
                    item-text="descricao"
                    label="Piquete/Lote"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col
                v-if="controle.exibir"
                cols="12"
                xl="2"
                lg="4"
                md="4"
                xs="12"
              >
                <v-autocomplete
                  v-model="formulario.piqueteId"
                  :items="dropdownPiquetes"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  class="required"
                  item-value="id"
                  item-text="codigo"
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col
                v-if="controle.exibir"
                cols="12"
                xl="2"
                lg="4"
                md="4"
                xs="12"
              >
                <v-autocomplete
                  v-model="formulario.loteId"
                  :items="dropdownLotes"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  item-value="id"
                  item-text="descricao"
                  label="Lote"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="4" md="4" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tipo de Ocorrência"
                  rules="required"
                  vid="tipoOcorrenciaId"
                >
                  <v-select
                    v-model="formulario.tipoOcorrenciaId"
                    :items="dropdownTipoOcorrencia"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Tipo de Ocorrência"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Observação"
                  rules="required|max:500"
                  vid="observacao"
                >
                  <v-textarea
                    v-model="formulario.observacao"
                    v-uppercase
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    counter
                    error-count="500"
                    dense
                    label="Observação"
                    outlined
                    rows="6"
                    spellcheck="false"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template slot="maisOpcoes">
      <v-list class="pa-0" dense>
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'excluir',
              text: 'Deseja realmente excluir esse registro?',
            }
          "
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="primary"> mdi-delete </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Excluir registro </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <date-picker
                  v-model="formulario.data"
                  hide-details
                  controlar-dia
                  dense
                  label="Data"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <select-all
                  v-model="filtro.piqueteId"
                  :items="dropdownPiquetes"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="descricao"
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <select-all
                  v-model="filtro.loteId"
                  :items="dropdownLotes"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="descricao"
                  label="Lote"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <select-all
                  v-model="filtro.tipoOcorrenciaId"
                  :items="dropdownTipoOcorrencia"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="descricao"
                  label="Tipo Ocorrencia"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>

      <tabela
        ref="paginacaoFake"
        :colunas="colunas"
        :registros="registros"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        class="mt-2"
        exibir
        height-auto
        toolbar-grid
        titulo="Listagem das Ocorrências"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroDeOcorrencia",

  data: () => ({
    aviso: {
      modal: false,
      key: null,
      text: "",
    },
    colunas: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 50,
      },
      {
        text: "Data",
        align: "start",
        sortable: true,
        value: "data",
        width: 100,
      },
      {
        text: "Tipo Ocorrência",
        align: "start",
        sortable: true,
        value: "tipoOcorrenciaDescricao",
        width: 100,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 100,
      },
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 250,
      },
      {
        text: "Observação",
        align: "start",
        sortable: true,
        value: "observacao",
      },
    ],
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      data: null,
      piqueteId: null,
      loteId: null,
      tipoOcorrenciaId: null,
    },
    formulario: {
      id: null,
      data: null,
      piqueteId: null,
      loteId: null,
      tipoOcorrenciaId: null,
      observacao: null,
    },
    loading: false,
    modal: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaCadastroOcorrencia", [
      "registros",
      "dropdownLotes",
      "dropdownPiquetes",
      "dropdownLotesAtivos",
      "dropdownTipoOcorrencia",
    ]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!this.filtro.descricao,
      };
    },
  },

  async created() {
    this.formulario.data = this.$day().format("YYYY-MM-DD");
    this.filtro.data = this.$day().format("YYYY-MM-DD");

    await this.dropdownLotesListar();
    await this.dropdownPiquetesListar();
    await this.dropdownLotesAtivosListar();
    await this.dropdownTipoOcorrenciaListar();
    this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaCadastroOcorrencia", [
      "dropdownLotesListar",
      "dropdownPiquetesListar",
      "dropdownTipoOcorrenciaListar",
      "dropdownLotesAtivosListar",

      "listar",
      "exibir",
      "editar",
      "salvar",
      "excluir",
    ]),
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          data: res.data || null,
          piqueteId: res.piqueteId || null,
          loteId: res.loteId || null,
          tipoOcorrenciaId: res.tipoOcorrenciaId || null,
          observacao: res.observacao || null,
        };
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.formulario.id);

      if (res && !res.erro) this.resetFormulario();

      this.loading = false;
    },
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        data: this.filtro.data || undefined,
        piqueteId: this.filtro.piqueteId || undefined,
        loteId: this.filtro.loteId || undefined,
        tipoOcorrenciaId: this.filtro.tipoOcorrenciaId || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        data: null,
        piqueteId: null,
        loteId: null,
        tipoOcorrenciaId: null,
      };
    },
    resetFormulario() {
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.formulario = {
        id: null,
        data: null,
        piqueteId: null,
        loteId: null,
        tipoOcorrenciaId: null,
        observacao: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          data: this.formulario.data || undefined,
          piqueteId:
            this.dropdownLotesAtivos.find(
              (el) => el.id === this.formulario.piqueteId
            ).piqueteId || undefined,
          loteId:
            this.dropdownLotesAtivos.find(
              (el) => el.id === this.formulario.piqueteId
            ).loteId || undefined,
          tipoOcorrenciaId: this.formulario.tipoOcorrenciaId || undefined,
          observacao: this.formulario.observacao || undefined,
        };
        let res;

        if (form.id) res = await this.editar(form);
        else if (!form.id) res = await this.salvar(form);

        if (res) {
          if (!res.erro) {
            if (res.id) this.exibirRegistro(res.id);
            else this.resetFormulario();
          } else if (typeof res.erro === "object") {
            this.$refs.observer.setErrors(res.erro);
            this.$setError({}, res.erro);
          }
        }

        this.loading = false;
      }
    },
  },
};
</script>
