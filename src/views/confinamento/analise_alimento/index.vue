<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    subtitulo="Alimentos para composição da receita"
    titulo-toolbar="Análise do Alimento"
    titulo="Análise de Alimento"
    fechar
    @cancelar="resetFormulario()"
    @editar="(controle.exibir = false), (controle.editar = true)"
    @fechar="resetFormulario()"
    @salvar="salvarRegistro()"
  >
    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Análise"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <date-picker
                  v-model="formulario.dataAnalise"
                  hide-details
                  type="date"
                  disabled
                  dense
                  label="Data Análise"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Alimento"
                  rules="required"
                  vid="alimentoId"
                >
                  <v-select
                    v-model="formulario.alimentoId"
                    :items="dropdownAlimento"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Alimento"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Massa Seca (%)"
                  rules="required"
                  vid="massaSeca"
                >
                  <v-text-field
                    v-model="formulario.massaSeca"
                    v-moeda="{ negativo: true, decimal: 2 }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Massa Seca (%)"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Observação"
                  vid="observacao"
                >
                  <v-textarea
                    v-model="formulario.observacao"
                    v-uppercase
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    label="Observação"
                    outlined
                    rows="3"
                    spellcheck="false"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
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
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.alimentoId"
                  :items="dropdownAlimento"
                  hide-details
                  dense
                  item-value="id"
                  item-text="descricao"
                  label="Alimento"
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
        titulo="Listagem das Análises dos Alimentos"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "PaginaCadastroAnaliseAlimento",

  data: () => ({
    colunas: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 50,
      },
      {
        text: "Status",
        align: "center",
        sortable: true,
        value: "status",
        width: 50,
      },
      {
        text: "Alimento",
        align: "start",
        sortable: true,
        value: "alimentoDescricao",
        width: 150,
      },
      {
        text: "Massa Seca (%)",
        align: "center",
        sortable: true,
        value: "massaSeca",
        width: 50,
      },
      {
        text: "Data Análise",
        align: "start",
        sortable: true,
        value: "dataAnalise",
        width: 150,
      },
      {},
    ],
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      alimentoId: null,
    },
    formulario: {
      id: null,
      status: null,
      alimentoId: null,
      dataAnalise: null,
      massaSeca: null,
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
    ...mapState("paginaConfinamentoAnaliseAlimento", [
      "registros",
      "dropdownAlimento",
    ]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!this.filtro.alimentoId,
      };
    },
  },

  async created() {
    await this.dropdownAlimentoListar();
    this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaConfinamentoAnaliseAlimento", [
      "listar",
      "exibir",
      "salvar",
      "dropdownAlimentoListar",
    ]),
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          status: res.status || null,
          alimentoId: res.alimentoId || null,
          dataAnalise: res.dataAnalise || null,
          massaSeca: Number(res.massaSeca) || null,
          observacao: res.observacao || null,
        };
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        alimentoId: this.filtro.alimentoId || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        alimentoId: null,
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
        status: null,
        alimentoId: null,
        dataAnalise: null,
        massaSeca: null,
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
          status: this.formulario.status || undefined,
          alimentoId: this.formulario.alimentoId || undefined,
          dataAnalise: this.formulario.dataAnalise || undefined,
          massaSeca: moeda.strip(this.formulario.massaSeca) || undefined,
          observacao: this.formulario.observacao || undefined,
        };

        let res = await this.salvar(form);

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
