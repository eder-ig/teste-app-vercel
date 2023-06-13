<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Relatório Resumo Dia"
    titulo="Relatório Resumo Dia"
  >
    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
        @imprimir="imprimirRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <validation-observer ref="observerFiltro">
              <v-row class="pa-0" dense>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Data"
                    rules="required"
                    vid="data"
                  >
                    <date-picker
                      v-model="filtro.data"
                      :error-messages="errors"
                      :hide-details="!errors.length"
                      controlar-dia
                      class="required"
                      dense
                      label="Data"
                      outlined
                      @input="listarRegistros()"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                  <v-text-field
                    v-model="filtro.loteDescricao"
                    v-mask="mascara('T', 250)"
                    hide-details
                    dense
                    label="Descrição do Lote"
                    outlined
                    @keypress.enter="listarRegistros()"
                  />
                </v-col>
              </v-row>
            </validation-observer>
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
        toolbar-grid
        titulo="Listagem do Resumo do Dia dos Lotes"
        @paginacao="paginacaoFake = $event"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "RelatorioResumoDoDia",

  data: () => ({
    colunas: [
      {
        text: "Data",
        align: "start",
        sortable: true,
        value: "data",
        width: 50,
      },
      {
        text: "Receita",
        align: "start",
        sortable: true,
        value: "receitaDescricao",
        width: 50,
      },
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 50,
      },
      {
        text: "Qtd. Prevista MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdPrevista",
        width: 50,
      },
      {
        text: "Qtd. Prevista Corrigida MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdPrevistaCorrigida",
        width: 50,
      },
      {
        text: "Qtd. Realizada MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdRealizada",
        width: 50,
      },
      {
        text: "Diferença Corrigido - Realizado (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "diferenca",
        width: 50,
      },
      {},
    ],
    filtro: {
      data: null,
      loteDescricao: null,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("relatorioResumoDia", ["registros"]),
    filtroValor() {
      return !!this.filtro.loteDescricao;
    },
    optionsFilter() {
      return {
        imprimir: {
          disabled: !this.registros.length,
        },
        values: this.filtroValor,
      };
    },
  },

  async created() {
    this.filtro.data = this.$day().format("YYYY-MM-DD");
    setTimeout(() => {
      this.listarRegistros();
    }, 200);
  },

  methods: {
    ...mapActions("relatorioResumoDia", ["listar", "imprimir"]),
    async listarRegistros() {
      if (await this.$refs.observerFiltro.validate()) {
        this.loading = true;

        await this.listar({
          data: this.filtro.data || undefined,
          loteDescricao: this.filtro.loteDescricao || undefined,
        });

        this.loading = false;
      }
    },
    limparFiltros() {
      this.filtro = {
        data: null,
        loteDescricao: null,
      };
    },

    async imprimirRegistros() {
      if (await this.$refs.observerFiltro.validate()) {
        this.loading = true;

        const res = await this.imprimir({
          data: this.filtro.data || undefined,
          loteDescricao: this.filtro.loteDescricao || undefined,
        });

        if (res && !res.erro) {
          const pdfBuffer = Buffer.from(res, "base64");
          const blob = new Blob([pdfBuffer], { type: "application/pdf" });

          window.open(window.URL.createObjectURL(blob));
        }

        this.loading = false;
      }
    },
  },
};
</script>
