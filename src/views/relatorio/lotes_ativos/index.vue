<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Relatório Lotes Ativos"
    titulo="Relatório Lotes Ativos"
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
            <v-row class="pa-0" dense>
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
        titulo="Listagem dos Lotes Ativos"
        @paginacao="paginacaoFake = $event"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "RelatorioLotesAtivos",

  data: () => ({
    colunas: [
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "lote",
        width: 50,
      },
      {
        text: "Raça",
        align: "start",
        sortable: true,
        value: "raca",
        width: 50,
      },
      {
        text: "Categoria",
        align: "start",
        sortable: true,
        value: "categoria",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdAnimais",
        width: 50,
      },
      {
        text: "Data Entrada",
        align: "start",
        sortable: true,
        sort: "date",
        value: "dataEntrada",
        width: 50,
      },
      {
        text: "Dias Conf.",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdDiasConf",
        width: 50,
      },
      {
        text: "Peso Médio Entrada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoEntrada",
        width: 50,
      },
      {
        text: "Qtd. MS (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioMs",
        width: 50,
      },
      {
        text: "Qtd. MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioMo",
        width: 50,
      },
      {
        text: "Qtd. MS Ult. 1 Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioUltimoDiaMs",
        width: 50,
      },
      {
        text: "Qtd. MO Ult. 1 Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioUltimoDiaMo",
        width: 50,
      },
      {
        text: "Qtd. MS Ult. 3 Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioUltimos3DiasMs",
        width: 50,
      },
      {
        text: "Qtd. MO Ult. 3 Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMedioUltimos3DiasMo",
        width: 50,
      },
      {
        text: "Dieta Atual",
        align: "start",
        sortable: true,
        value: "dieta",
        width: 50,
      },
      {
        text: "Peso Previsto para Abate (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoEsperadoAbate",
        width: 50,
      },
      {
        text: "Peso Médio Atual (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioAtual",
        width: 50,
      },
      {
        text: "GMD (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "gmd",
        width: 50,
      },
      {
        text: "Qtd. Dias Estimado Conf.",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdDiasEstimadoConfinamento",
        width: 50,
      },
      {
        text: "Data Estimada Abate",
        align: "start",
        sortable: true,
        sort: "date",
        value: "dataEsperadaAbate",
        width: 50,
      },
      {},
    ],
    filtro: {
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
    ...mapState("relatorioLotesAtivos", ["registros"]),
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
    this.listarRegistros();
  },

  methods: {
    ...mapActions("relatorioLotesAtivos", ["listar", "imprimir"]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        loteDescricao: this.filtro.loteDescricao || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        loteDescricao: null,
      };
    },

    async imprimirRegistros() {
      this.loading = true;

      const res = await this.imprimir({
        loteDescricao: this.filtro.loteDescricao || undefined,
      });

      if (res && !res.erro) {
        const pdfBuffer = Buffer.from(res, "base64");
        const blob = new Blob([pdfBuffer], { type: "application/pdf" });

        window.open(window.URL.createObjectURL(blob));
      }

      this.loading = false;
    },
  },
};
</script>
